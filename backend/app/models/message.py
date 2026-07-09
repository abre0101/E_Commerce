from app import mongo
from bson import ObjectId
from datetime import datetime

class Message:
    collection = "messages"

    @staticmethod
    def send(data):
        msg = {
            "sender_id": data["sender_id"],
            "receiver_id": data["receiver_id"],
            "product_id": data.get("product_id", ""),
            "text": data["text"],
            "is_read": False,
            "created_at": datetime.utcnow(),
        }
        result = mongo.db[Message.collection].insert_one(msg)
        return str(result.inserted_id)

    @staticmethod
    def get_conversation(user1_id, user2_id):
        return list(mongo.db[Message.collection].find({
            "$or": [
                {"sender_id": user1_id, "receiver_id": user2_id},
                {"sender_id": user2_id, "receiver_id": user1_id},
            ]
        }).sort("created_at", 1))

    @staticmethod
    def get_inbox(user_id):
        pipeline = [
            {"$match": {"$or": [{"sender_id": user_id}, {"receiver_id": user_id}]}},
            {"$sort": {"created_at": -1}},
            {"$group": {
                "_id": {
                    "$cond": [{"$eq": ["$sender_id", user_id]}, "$receiver_id", "$sender_id"]
                },
                "last_message": {"$first": "$$ROOT"}
            }}
        ]
        return list(mongo.db[Message.collection].aggregate(pipeline))

    @staticmethod
    def mark_read(sender_id, receiver_id):
        mongo.db[Message.collection].update_many(
            {"sender_id": sender_id, "receiver_id": receiver_id, "is_read": False},
            {"$set": {"is_read": True}}
        )
