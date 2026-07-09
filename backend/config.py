import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/vibey_world_market")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "vibey-world-secret")
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB upload limit
    CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
    CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
    CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")
