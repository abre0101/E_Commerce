from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.product import Product
from app.models.order import Order
from app.models.review import Review
from app.models.user import User
from app import mongo

sellers_bp = Blueprint("sellers", __name__)

@sellers_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)
    if user["role"] not in ("seller", "admin"):
        return jsonify({"error": "Sellers only"}), 403

    products = Product.find_by_seller(user_id)
    orders = Order.find_by_seller(user_id)
    reviews = Review.find_by_seller(user_id)

    total_revenue = sum(o["total"] for o in orders if o["status"] == "delivered")
    total_views = sum(p.get("views", 0) for p in products)

    for p in products:
        p["id"] = str(p["_id"]); del p["_id"]
    for o in orders:
        o["id"] = str(o["_id"]); del o["_id"]

    return jsonify({
        "stats": {
            "total_products": len(products),
            "total_orders": len(orders),
            "total_revenue": total_revenue,
            "total_views": total_views,
            "review_count": len(reviews),
        },
        "products": products,
        "recent_orders": orders[:10],
    }), 200

@sellers_bp.route("/become-seller", methods=["POST"])
@jwt_required()
def become_seller():
    user_id = get_jwt_identity()
    data = request.get_json()
    User.update(user_id, {
        "role": "seller",
        "shop_name": data.get("shop_name", ""),
        "shop_description": data.get("shop_description", ""),
        "shop_location": data.get("shop_location", ""),
    })
    return jsonify({"message": "Seller account activated"}), 200

@sellers_bp.route("/<seller_id>/profile", methods=["GET"])
def seller_profile(seller_id):
    user = User.find_by_id(seller_id)
    if not user or user["role"] not in ("seller", "admin"):
        return jsonify({"error": "Seller not found"}), 404
    products = Product.find_by_seller(seller_id)
    for p in products:
        p["id"] = str(p["_id"]); del p["_id"]
    reviews = Review.find_by_seller(seller_id)
    avg_rating = (sum(r["rating"] for r in reviews) / len(reviews)) if reviews else 0
    return jsonify({
        "seller": {
            "id": str(user["_id"]),
            "name": user["name"],
            "shop_name": user.get("shop_name", ""),
            "shop_description": user.get("shop_description", ""),
            "location": user.get("location", ""),
            "avatar": user.get("avatar", ""),
            "member_since": user["created_at"].isoformat(),
            "avg_rating": round(avg_rating, 1),
            "review_count": len(reviews),
        },
        "products": products
    }), 200
