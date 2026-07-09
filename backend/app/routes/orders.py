from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.order import Order
from app.models.user import User

orders_bp = Blueprint("orders", __name__)

def serialize(order):
    order["id"] = str(order["_id"]); del order["_id"]
    return order

@orders_bp.route("/", methods=["POST"])
@jwt_required()
def place_order():
    user_id = get_jwt_identity()
    data = request.get_json()
    data["buyer_id"] = user_id
    order_id = Order.create(data)
    return jsonify({"id": order_id, "message": "Order placed"}), 201

@orders_bp.route("/my", methods=["GET"])
@jwt_required()
def my_orders():
    user_id = get_jwt_identity()
    orders = Order.find_by_buyer(user_id)
    return jsonify([serialize(o) for o in orders]), 200

@orders_bp.route("/<order_id>", methods=["GET"])
@jwt_required()
def get_order(order_id):
    user_id = get_jwt_identity()
    order = Order.find_by_id(order_id)
    if not order:
        return jsonify({"error": "Not found"}), 404
    user = User.find_by_id(user_id)
    if order["buyer_id"] != user_id and order["seller_id"] != user_id and user["role"] != "admin":
        return jsonify({"error": "Unauthorized"}), 403
    return jsonify(serialize(order)), 200

@orders_bp.route("/<order_id>/status", methods=["PUT"])
@jwt_required()
def update_status(order_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    order = Order.find_by_id(order_id)
    if not order:
        return jsonify({"error": "Not found"}), 404
    user = User.find_by_id(user_id)
    if order["seller_id"] != user_id and user["role"] != "admin":
        return jsonify({"error": "Unauthorized"}), 403
    Order.update_status(order_id, data["status"])
    return jsonify({"message": "Status updated"}), 200
