from flask import Blueprint, jsonify
import os

seed_bp = Blueprint("seed", __name__)

@seed_bp.route("/run", methods=["POST"])
def run_seed():
    try:
        import sys
        sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
        from seed_data import (
            seed_users, seed_products, seed_orders, seed_reviews, seed_messages, clear_database
        )
        clear_database()
        user_ids = seed_users()
        product_ids = seed_products(user_ids)
        seed_orders(user_ids, product_ids)
        seed_reviews(user_ids, product_ids)
        seed_messages(user_ids)
        return jsonify({"status": "success", "message": "Database seeded successfully"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
