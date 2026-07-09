from app import mongo
from bson import ObjectId
from datetime import datetime

class Order:
    collection = "orders"

    @staticmethod
    def create(data):
        order = {
            "buyer_id": data["buyer_id"],
            "seller_id": data["seller_id"],
            "items": data["items"],  # [{product_id, title, price, qty, image}]
            "total": float(data["total"]),
            "currency": "ETB",
            "payment_method": data.get("payment_method", "cash_on_delivery"),
            "payment_status": "pending",  # pending | paid | failed
            "status": "pending",  # pending | confirmed | shipped | delivered | cancelled
            "shipping_address": data.get("shipping_address", {}),
            "notes": data.get("notes", ""),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        result = mongo.db[Order.collection].insert_one(order)
        return str(result.inserted_id)

    @staticmethod
    def find_by_buyer(buyer_id):
        return list(mongo.db[Order.collection].find({"buyer_id": buyer_id}).sort("created_at", -1))

    @staticmethod
    def find_by_seller(seller_id):
        return list(mongo.db[Order.collection].find({"seller_id": seller_id}).sort("created_at", -1))

    @staticmethod
    def find_by_id(order_id):
        return mongo.db[Order.collection].find_one({"_id": ObjectId(order_id)})

    @staticmethod
    def update_status(order_id, status):
        mongo.db[Order.collection].update_one(
            {"_id": ObjectId(order_id)},
            {"$set": {"status": status, "updated_at": datetime.utcnow()}}
        )
