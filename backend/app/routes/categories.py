from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app import mongo
from bson import ObjectId
from datetime import datetime

categories_bp = Blueprint("categories", __name__)

DEFAULT_CATEGORIES = [
    {"name": "Electronics", "subcategories": ["Phones", "Laptops", "Accessories", "TVs"]},
    {"name": "Fashion", "subcategories": ["Men's Clothing", "Women's Clothing", "Shoes", "Bags"]},
    {"name": "Health & Beauties", "subcategories": ["Perfume", "Skincare", "Hair Care", "Makeup"]},
    {"name": "Home & Garden", "subcategories": ["Furniture", "Kitchen", "Decor", "Cleaning"]},
    {"name": "Vehicles", "subcategories": ["Cars", "Motorcycles", "Spare Parts", "Accessories"]},
    {"name": "Real Estate", "subcategories": ["Houses", "Apartments", "Land", "Commercial"]},
    {"name": "Food & Beverages", "subcategories": ["Spices", "Beverages", "Snacks", "Organic"]},
    {"name": "Sports", "subcategories": ["Gym Equipment", "Outdoor", "Team Sports", "Cycling"]},
]

@categories_bp.route("/", methods=["GET"])
def get_categories():
    cats = list(mongo.db.categories.find())
    if not cats:
        return jsonify(DEFAULT_CATEGORIES), 200
    for c in cats:
        c["id"] = str(c["_id"]); del c["_id"]
    return jsonify(cats), 200

@categories_bp.route("/", methods=["POST"])
@jwt_required()
def create_category():
    user_id = get_jwt_identity()
    user = User.find_by_id(user_id)
    if user["role"] != "admin":
        return jsonify({"error": "Admin only"}), 403
    data = request.get_json()
    data["created_at"] = datetime.utcnow()
    result = mongo.db.categories.insert_one(data)
    return jsonify({"id": str(result.inserted_id)}), 201
