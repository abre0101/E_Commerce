from app import mongo
from bson import ObjectId
from datetime import datetime

class Product:
    collection = "products"

    @staticmethod
    def create(data):
        product = {
            "title": data["title"],
            "description": data.get("description", ""),
            "price": float(data["price"]),
            "currency": "ETB",
            "images": data.get("images", []),
            "category": data["category"],
            "subcategory": data.get("subcategory", ""),
            "condition": data.get("condition", "new"),  # new | used
            "attributes": data.get("attributes", {}),  # brand, gender, scent, etc.
            "location": data.get("location", "Addis Ababa"),
            "seller_id": data["seller_id"],
            "seller_name": data.get("seller_name", ""),
            "stock": int(data.get("stock", 1)),
            "is_active": True,
            "is_approved": False,  # admin must approve
            "views": 0,
            "rating": 0,
            "review_count": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        result = mongo.db[Product.collection].insert_one(product)
        return str(result.inserted_id)

    @staticmethod
    def find_all(filters=None, sort_by="created_at", page=1, limit=20):
        query = {"is_active": True, "is_approved": True}
        if filters:
            query.update(filters)
        skip = (page - 1) * limit
        cursor = mongo.db[Product.collection].find(query).sort(sort_by, -1).skip(skip).limit(limit)
        total = mongo.db[Product.collection].count_documents(query)
        return list(cursor), total

    @staticmethod
    def find_by_id(product_id):
        return mongo.db[Product.collection].find_one({"_id": ObjectId(product_id)})

    @staticmethod
    def find_by_seller(seller_id):
        return list(mongo.db[Product.collection].find({"seller_id": seller_id}))

    @staticmethod
    def update(product_id, data):
        data["updated_at"] = datetime.utcnow()
        mongo.db[Product.collection].update_one(
            {"_id": ObjectId(product_id)}, {"$set": data}
        )

    @staticmethod
    def delete(product_id):
        mongo.db[Product.collection].update_one(
            {"_id": ObjectId(product_id)}, {"$set": {"is_active": False}}
        )

    @staticmethod
    def increment_views(product_id):
        mongo.db[Product.collection].update_one(
            {"_id": ObjectId(product_id)}, {"$inc": {"views": 1}}
        )

    @staticmethod
    def search(query, filters=None, page=1, limit=20):
        base = {
            "is_active": True, "is_approved": True,
            "$text": {"$search": query}
        }
        if filters:
            base.update(filters)
        skip = (page - 1) * limit
        cursor = mongo.db[Product.collection].find(base).skip(skip).limit(limit)
        total = mongo.db[Product.collection].count_documents(base)
        return list(cursor), total
