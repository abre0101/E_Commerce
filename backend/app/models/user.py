from app import mongo
from bson import ObjectId
import bcrypt
from datetime import datetime

class User:
    collection = "users"

    @staticmethod
    def create(data):
        hashed = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt())
        user = {
            "name": data["name"],
            "email": data["email"].lower(),
            "password": hashed,
            "role": data.get("role", "buyer"),  # buyer | seller | admin
            "avatar": data.get("avatar", ""),
            "phone": data.get("phone", ""),
            "location": data.get("location", ""),
            "wishlist": [],
            "is_active": True,
            "created_at": datetime.utcnow(),
        }
        result = mongo.db[User.collection].insert_one(user)
        return str(result.inserted_id)

    @staticmethod
    def find_by_email(email):
        return mongo.db[User.collection].find_one({"email": email.lower()})

    @staticmethod
    def find_by_id(user_id):
        return mongo.db[User.collection].find_one({"_id": ObjectId(user_id)})

    @staticmethod
    def verify_password(plain, hashed):
        return bcrypt.checkpw(plain.encode(), hashed)

    @staticmethod
    def update(user_id, data):
        mongo.db[User.collection].update_one(
            {"_id": ObjectId(user_id)}, {"$set": data}
        )

    @staticmethod
    def toggle_wishlist(user_id, product_id):
        user = User.find_by_id(user_id)
        wishlist = user.get("wishlist", [])
        if product_id in wishlist:
            wishlist.remove(product_id)
        else:
            wishlist.append(product_id)
        User.update(user_id, {"wishlist": wishlist})
        return wishlist
