from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from app.models.product import Product
from app.models.review import Review
from app.models.user import User
from app import mongo
from bson import ObjectId

products_bp = Blueprint("products", __name__)

def serialize(product):
    product["id"] = str(product["_id"])
    del product["_id"]
    return product

@products_bp.route("/", methods=["GET"])
def get_products():
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 20))
    category = request.args.get("category")
    subcategory = request.args.get("subcategory")
    condition = request.args.get("condition")
    min_price = request.args.get("min_price")
    max_price = request.args.get("max_price")
    sort_by = request.args.get("sort", "created_at")
    location = request.args.get("location")

    filters = {}
    if category:
        filters["category"] = category
    if subcategory:
        filters["subcategory"] = subcategory
    if condition:
        filters["condition"] = condition
    if location:
        filters["location"] = {"$regex": location, "$options": "i"}
    if min_price or max_price:
        filters["price"] = {}
        if min_price:
            filters["price"]["$gte"] = float(min_price)
        if max_price:
            filters["price"]["$lte"] = float(max_price)

    products, total = Product.find_all(filters, sort_by, page, limit)
    return jsonify({
        "products": [serialize(p) for p in products],
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit
    }), 200

@products_bp.route("/search", methods=["GET"])
def search():
    q = request.args.get("q", "")
    page = int(request.args.get("page", 1))
    if not q:
        return get_products()
    # Fallback to regex if no text index
    products = list(mongo.db.products.find({
        "is_active": True, "is_approved": True,
        "$or": [
            {"title": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"category": {"$regex": q, "$options": "i"}},
        ]
    }).skip((page - 1) * 20).limit(20))
    total = len(products)
    return jsonify({"products": [serialize(p) for p in products], "total": total}), 200

@products_bp.route("/<product_id>", methods=["GET"])
def get_product(product_id):
    product = Product.find_by_id(product_id)
    if not product:
        return jsonify({"error": "Not found"}), 404
    Product.increment_views(product_id)
    reviews = Review.find_by_product(product_id)
    for r in reviews:
        r["id"] = str(r["_id"]); del r["_id"]
    product["reviews"] = reviews
    return jsonify(serialize(product)), 200

@products_bp.route("/", methods=["POST"])
@jwt_required()
def create_product():
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)
    if user["role"] not in ("seller", "admin"):
        return jsonify({"error": "Sellers only"}), 403
    data = request.get_json()
    data["seller_id"] = user_id
    data["seller_name"] = user["name"]
    product_id = Product.create(data)
    return jsonify({"id": product_id, "message": "Product submitted for approval"}), 201

@products_bp.route("/<product_id>", methods=["PUT"])
@jwt_required()
def update_product(product_id):
    user_id = get_jwt_identity()
    product = Product.find_by_id(product_id)
    if not product:
        return jsonify({"error": "Not found"}), 404
    user = User.find_by_id(user_id)
    if product["seller_id"] != user_id and user["role"] != "admin":
        return jsonify({"error": "Unauthorized"}), 403
    data = request.get_json()
    Product.update(product_id, data)
    return jsonify({"message": "Updated"}), 200

@products_bp.route("/<product_id>", methods=["DELETE"])
@jwt_required()
def delete_product(product_id):
    user_id = get_jwt_identity()
    product = Product.find_by_id(product_id)
    if not product:
        return jsonify({"error": "Not found"}), 404
    user = User.find_by_id(user_id)
    if product["seller_id"] != user_id and user["role"] != "admin":
        return jsonify({"error": "Unauthorized"}), 403
    Product.delete(product_id)
    return jsonify({"message": "Deleted"}), 200

@products_bp.route("/<product_id>/review", methods=["POST"])
@jwt_required()
def add_review(product_id):
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)
    data = request.get_json()
    product = Product.find_by_id(product_id)
    if not product:
        return jsonify({"error": "Not found"}), 404
    data["product_id"] = product_id
    data["seller_id"] = product["seller_id"]
    data["buyer_id"] = user_id
    data["buyer_name"] = user["name"]
    Review.create(data)
    return jsonify({"message": "Review added"}), 201
