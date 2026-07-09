from app import mongo
from bson import ObjectId
from datetime import datetime

class Review:
    collection = "reviews"

    @staticmethod
    def create(data):
        review = {
            "product_id": data["product_id"],
            "seller_id": data["seller_id"],
            "buyer_id": data["buyer_id"],
            "buyer_name": data.get("buyer_name", ""),
            "rating": int(data["rating"]),  # 1-5
            "comment": data.get("comment", ""),
            "created_at": datetime.utcnow(),
        }
        result = mongo.db[Review.collection].insert_one(review)
        # Update product avg rating
        reviews = list(mongo.db[Review.collection].find({"product_id": data["product_id"]}))
        avg = sum(r["rating"] for r in reviews) / len(reviews)
        mongo.db["products"].update_one(
            {"_id": ObjectId(data["product_id"])},
            {"$set": {"rating": round(avg, 1), "review_count": len(reviews)}}
        )
        return str(result.inserted_id)

    @staticmethod
    def find_by_product(product_id):
        return list(mongo.db[Review.collection].find({"product_id": product_id}).sort("created_at", -1))

    @staticmethod
    def find_by_seller(seller_id):
        return list(mongo.db[Review.collection].find({"seller_id": seller_id}).sort("created_at", -1))
