from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.user import User
from bson import ObjectId

auth_bp = Blueprint("auth", __name__)

def serialize_user(user):
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "avatar": user.get("avatar", ""),
        "phone": user.get("phone", ""),
        "location": user.get("location", ""),
    }

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    required = ["name", "email", "password"]
    if not all(k in data for k in required):
        return jsonify({"error": "Missing required fields"}), 400
    if User.find_by_email(data["email"]):
        return jsonify({"error": "Email already registered"}), 409
    user_id = User.create(data)
    user = User.find_by_id(user_id)
    token = create_access_token(identity=user_id)
    return jsonify({"token": token, "user": serialize_user(user)}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.find_by_email(data.get("email", ""))
    if not user or not User.verify_password(data.get("password", ""), user["password"]):
        return jsonify({"error": "Invalid credentials"}), 401
    if not user.get("is_active"):
        return jsonify({"error": "Account disabled"}), 403
    token = create_access_token(identity=str(user["_id"]))
    return jsonify({"token": token, "user": serialize_user(user)}), 200

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(serialize_user(user)), 200

@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    allowed = ["name", "phone", "location", "avatar"]
    update = {k: v for k, v in data.items() if k in allowed}
    User.update(user_id, update)
    user = User.find_by_id(user_id)
    return jsonify(serialize_user(user)), 200

@auth_bp.route("/wishlist/<product_id>", methods=["POST"])
@jwt_required()
def toggle_wishlist(product_id):
    user_id = get_jwt_identity()
    wishlist = User.toggle_wishlist(user_id, product_id)
    return jsonify({"wishlist": wishlist}), 200
