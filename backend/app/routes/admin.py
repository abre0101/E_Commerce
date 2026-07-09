from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app import mongo
from bson import ObjectId

admin_bp = Blueprint("admin", __name__)

def require_admin():
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)
    if not user or user["role"] != "admin":
        return None, user_id
    return user, user_id

@admin_bp.route("/stats", methods=["GET"])
@jwt_required()
def stats():
    admin, _ = require_admin()
    if not admin:
        return jsonify({"error": "Admin only"}), 403

    total_users = mongo.db.users.count_documents({})
    total_sellers = mongo.db.users.count_documents({"role": "seller"})
    total_products = mongo.db.products.count_documents({"is_active": True})
    pending_products = mongo.db.products.count_documents({"is_approved": False, "is_active": True})
    total_orders = mongo.db.orders.count_documents({})

    return jsonify({
        "total_users": total_users,
        "total_sellers": total_sellers,
        "total_products": total_products,
        "pending_products": pending_products,
        "total_orders": total_orders,
    }), 200

@admin_bp.route("/products/pending", methods=["GET"])
@jwt_required()
def pending_products():
    admin, _ = require_admin()
    if not admin:
        return jsonify({"error": "Admin only"}), 403
    products = list(mongo.db.products.find({"is_approved": False, "is_active": True}))
    for p in products:
        p["id"] = str(p["_id"]); del p["_id"]
    return jsonify(products), 200

@admin_bp.route("/products/<product_id>/approve", methods=["PUT"])
@jwt_required()
def approve_product(product_id):
    admin, _ = require_admin()
    if not admin:
        return jsonify({"error": "Admin only"}), 403
    Product.update(product_id, {"is_approved": True})
    return jsonify({"message": "Approved"}), 200

@admin_bp.route("/products/<product_id>/reject", methods=["DELETE"])
@jwt_required()
def reject_product(product_id):
    admin, _ = require_admin()
    if not admin:
        return jsonify({"error": "Admin only"}), 403
    Product.delete(product_id)
    return jsonify({"message": "Rejected"}), 200

@admin_bp.route("/users", methods=["GET"])
@jwt_required()
def list_users():
    admin, _ = require_admin()
    if not admin:
        return jsonify({"error": "Admin only"}), 403
    users = list(mongo.db.users.find({}, {"password": 0}))
    for u in users:
        u["id"] = str(u["_id"]); del u["_id"]
    return jsonify(users), 200

@admin_bp.route("/users/<user_id>/toggle", methods=["PUT"])
@jwt_required()
def toggle_user(user_id):
    admin, _ = require_admin()
    if not admin:
        return jsonify({"error": "Admin only"}), 403
    user = User.find_by_id(user_id)
    User.update(user_id, {"is_active": not user.get("is_active", True)})
    return jsonify({"message": "Updated"}), 200
