"""
Database Seeding Script for Vibey World Market
Run this script to populate the database with sample data
"""
from app import create_app, mongo
from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app.models.review import Review
from app.models.message import Message
from datetime import datetime, timedelta
import random

app = create_app()

def clear_database():
    """Clear all collections"""
    with app.app_context():
        print("🗑️  Clearing database...")
        mongo.db.users.delete_many({})
        mongo.db.products.delete_many({})
        mongo.db.orders.delete_many({})
        mongo.db.reviews.delete_many({})
        mongo.db.messages.delete_many({})
        print("✅ Database cleared")

def seed_users():
    """Create sample users"""
    with app.app_context():
        print("👥 Creating users...")
        
        users_data = [
            # Admin - Shop Owner
            {
                "name": "Abebe Bekele",
                "email": "admin@vibeyworld.com",
                "password": "admin123",
                "role": "admin",
                "phone": "+251911234567",
                "location": "Addis Ababa, Bole",
                "avatar": "https://i.pravatar.cc/150?img=1"
            },
            # Shop Manager (also acts as seller for the single shop)
            {
                "name": "Vibey World Market",
                "email": "shop@vibeyworld.com",
                "password": "seller123",
                "role": "seller",
                "phone": "+251922345678",
                "location": "Addis Ababa, Bole",
                "avatar": "https://i.pravatar.cc/150?img=5"
            },
            # Buyers/Customers
            {
                "name": "Kidus Tesfaye",
                "email": "kidus@example.com",
                "password": "buyer123",
                "role": "buyer",
                "phone": "+251977890123",
                "location": "Addis Ababa, CMC",
                "avatar": "https://i.pravatar.cc/150?img=8"
            },
            {
                "name": "Sara Alemayehu",
                "email": "sara@example.com",
                "password": "buyer123",
                "role": "buyer",
                "phone": "+251988901234",
                "location": "Bahir Dar",
                "avatar": "https://i.pravatar.cc/150?img=9"
            },
            {
                "name": "Daniel Haile",
                "email": "daniel@example.com",
                "password": "buyer123",
                "role": "buyer",
                "phone": "+251999012345",
                "location": "Hawassa",
                "avatar": "https://i.pravatar.cc/150?img=15"
            },
            {
                "name": "Bethlehem Girma",
                "email": "bethlehem@example.com",
                "password": "buyer123",
                "role": "buyer",
                "phone": "+251911567890",
                "location": "Dire Dawa",
                "avatar": "https://i.pravatar.cc/150?img=27"
            },
            {
                "name": "Meron Tadesse",
                "email": "meron@example.com",
                "password": "buyer123",
                "role": "buyer",
                "phone": "+251933456789",
                "location": "Addis Ababa, Merkato",
                "avatar": "https://i.pravatar.cc/150?img=20"
            },
            {
                "name": "Yohannes Kebede",
                "email": "yohannes@example.com",
                "password": "buyer123",
                "role": "buyer",
                "phone": "+251944567890",
                "location": "Addis Ababa, Piazza",
                "avatar": "https://i.pravatar.cc/150?img=12"
            }
        ]
        
        user_ids = {}
        for user_data in users_data:
            user_id = User.create(user_data)
            user_ids[user_data["email"]] = user_id
            print(f"   ✓ Created {user_data['role']}: {user_data['name']}")
        
        print(f"✅ Created {len(users_data)} users")
        return user_ids

def seed_products(user_ids):
    """Create sample products"""
    with app.app_context():
        print("📦 Creating products...")
        
        products_data = [
            # Traditional Ethiopian Fashion
            {
                "title": "Habesha Kemis - White with Gold Tibeb",
                "description": "Stunning handwoven traditional Ethiopian dress (Habesha Kemis) with intricate gold Tibeb embroidery. Perfect for weddings and special occasions. Made from 100% cotton.",
                "price": 4500,
                "images": [
                    "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=500",
                    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500"
                ],
                "category": "Fashion",
                "subcategory": "Traditional Wear",
                "condition": "new",
                "attributes": {"size": "Free Size", "color": "White/Gold", "handmade": "Yes", "material": "Cotton"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 12
            },
            {
                "title": "Men's Habesha Libs - Traditional Suit",
                "description": "Elegant handwoven Ethiopian men's traditional suit with embroidered collar and cuffs. Perfect for holidays and celebrations.",
                "price": 3800,
                "images": [
                    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500"
                ],
                "category": "Fashion",
                "subcategory": "Traditional Wear",
                "condition": "new",
                "attributes": {"size": "L", "color": "Beige", "handmade": "Yes"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 8
            },
            {
                "title": "Netela - Ethiopian Traditional Scarf",
                "description": "Beautiful handwoven Netela with colorful Tibeb border. Can be worn as shawl or head covering. Essential for traditional ceremonies.",
                "price": 850,
                "images": [
                    "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500"
                ],
                "category": "Fashion",
                "subcategory": "Accessories",
                "condition": "new",
                "attributes": {"material": "Cotton", "color": "White/Multi", "handmade": "Yes"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 25
            },
            {
                "title": "Ethiopian Leather Handbag - Handcrafted",
                "description": "Handcrafted genuine Ethiopian leather handbag with traditional patterns. Spacious with multiple compartments.",
                "price": 1800,
                "images": [
                    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500"
                ],
                "category": "Fashion",
                "subcategory": "Bags & Accessories",
                "condition": "new",
                "attributes": {"material": "Genuine Leather", "color": "Brown", "handmade": "Yes"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 15
            },
            {
                "title": "Kuta - Traditional Ethiopian Vest",
                "description": "Handwoven Ethiopian Kuta vest with embroidered details. Perfect over traditional or modern outfits.",
                "price": 1200,
                "images": [
                    "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=500"
                ],
                "category": "Fashion",
                "subcategory": "Traditional Wear",
                "condition": "new",
                "attributes": {"size": "M/L", "color": "White", "handmade": "Yes"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 18
            },
            # Electronics
            {
                "title": "Wireless Bluetooth Headphones",
                "description": "High-quality wireless headphones with noise cancellation. Perfect for music and calls. 30-hour battery life.",
                "price": 2500,
                "images": [
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
                ],
                "category": "Electronics",
                "subcategory": "Audio",
                "condition": "new",
                "attributes": {"brand": "TechPro", "color": "Black", "wireless": "Yes"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 20
            },
            {
                "title": "Smart Watch with Amharic Support",
                "description": "Feature-rich smartwatch with fitness tracking, heart rate monitor, and Amharic language support. Water-resistant design.",
                "price": 4500,
                "images": [
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
                ],
                "category": "Electronics",
                "subcategory": "Wearables",
                "condition": "new",
                "attributes": {"brand": "SmartTech", "color": "Black", "waterproof": "Yes", "language": "Amharic"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 12
            },
            {
                "title": "Solar Power Bank 20000mAh",
                "description": "Portable solar power bank perfect for Ethiopian weather. Fast charging with dual USB ports. Essential for travel.",
                "price": 1200,
                "images": [
                    "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500"
                ],
                "category": "Electronics",
                "subcategory": "Accessories",
                "condition": "new",
                "attributes": {"capacity": "20000mAh", "solar": "Yes", "color": "Black"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 30
            },
            {
                "title": "LED Desk Lamp - USB Rechargeable",
                "description": "Energy-efficient LED desk lamp with adjustable brightness. USB rechargeable, perfect for studying.",
                "price": 650,
                "images": [
                    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500"
                ],
                "category": "Electronics",
                "subcategory": "Lighting",
                "condition": "new",
                "attributes": {"power": "USB", "adjustable": "Yes"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 25
            },
            # Sports & Fitness
            {
                "title": "Ethiopian Football League Soccer Ball",
                "description": "Official Ethiopian Premier League soccer ball, perfect for matches and training. FIFA standard size 5.",
                "price": 650,
                "images": [
                    "https://images.unsplash.com/photo-1614632537197-38a17061e40a?w=500"
                ],
                "category": "Sports",
                "subcategory": "Team Sports",
                "condition": "new",
                "attributes": {"size": "5", "brand": "ProSports", "official": "Yes"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 25
            },
            {
                "title": "Yoga Mat - Ethiopian Flag Colors",
                "description": "Extra thick yoga mat with non-slip surface in Ethiopian flag colors. Includes carrying bag and strap.",
                "price": 750,
                "images": [
                    "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500"
                ],
                "category": "Sports",
                "subcategory": "Fitness",
                "condition": "new",
                "attributes": {"thickness": "6mm", "color": "Green/Yellow/Red"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 18
            },
            {
                "title": "Running Shoes - Ethiopian Marathon Edition",
                "description": "Lightweight running shoes inspired by Ethiopian marathon champions. Excellent cushioning and support for long-distance running.",
                "price": 1800,
                "images": [
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
                ],
                "category": "Sports",
                "subcategory": "Footwear",
                "condition": "new",
                "attributes": {"size": "42", "color": "Green/Yellow", "brand": "RunEthiopia"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 22
            },
            {
                "title": "Basketball - Indoor/Outdoor",
                "description": "High-quality basketball suitable for both indoor and outdoor play. Size 7 official.",
                "price": 580,
                "images": [
                    "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500"
                ],
                "category": "Sports",
                "subcategory": "Team Sports",
                "condition": "new",
                "attributes": {"size": "7", "type": "Indoor/Outdoor"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 20
            },
            # Home & Living - Ethiopian Coffee Culture
            {
                "title": "Ethiopian Coffee Ceremony Set - Jebena",
                "description": "Traditional handmade clay Jebena (coffee pot) with 6 cups, saucer, and incense burner. Complete set for authentic Ethiopian coffee ceremony.",
                "price": 1500,
                "images": [
                    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500"
                ],
                "category": "Home & Living",
                "subcategory": "Coffee & Tea",
                "condition": "new",
                "attributes": {"pieces": "9", "handmade": "Yes", "material": "Clay"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 15
            },
            {
                "title": "Mesob - Ethiopian Basket Table",
                "description": "Beautiful handwoven Mesob (traditional Ethiopian serving basket) with lid. Perfect for serving injera and wot. Large size for families.",
                "price": 2200,
                "images": [
                    "https://images.unsplash.com/photo-1585328862881-c0693a7ad9b6?w=500"
                ],
                "category": "Home & Living",
                "subcategory": "Tableware",
                "condition": "new",
                "attributes": {"size": "Large", "handmade": "Yes", "color": "Multi-color"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 10
            },
            {
                "title": "Ethiopian Wall Art - Lalibela Churches",
                "description": "Beautiful canvas print of Lalibela rock-hewn churches. Premium quality print perfect for home or office decoration.",
                "price": 980,
                "images": [
                    "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=500"
                ],
                "category": "Home & Living",
                "subcategory": "Wall Decor",
                "condition": "new",
                "attributes": {"size": "60x40cm", "material": "Canvas"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 12
            },
            {
                "title": "Ethiopian Incense - Etan (5 Boxes)",
                "description": "Traditional Ethiopian incense (Etan) made from natural ingredients. Essential for coffee ceremony. Set of 5 boxes.",
                "price": 350,
                "images": [
                    "https://images.unsplash.com/photo-1602874801006-926d55607566?w=500"
                ],
                "category": "Home & Living",
                "subcategory": "Home Fragrance",
                "condition": "new",
                "attributes": {"boxes": "5", "natural": "Yes"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 40
            },
            {
                "title": "Rekebot - Traditional Coffee Stand",
                "description": "Handwoven grass Rekebot (coffee ceremony stand) for placing hot Jebena. Protects surfaces and adds authenticity.",
                "price": 280,
                "images": [
                    "https://images.unsplash.com/photo-1585328862881-c0693a7ad9b6?w=500"
                ],
                "category": "Home & Living",
                "subcategory": "Coffee & Tea",
                "condition": "new",
                "attributes": {"handmade": "Yes", "material": "Grass"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 30
            },
            # Ethiopian Food & Spices
            {
                "title": "Berbere Spice Mix - Premium 500g",
                "description": "Premium authentic Ethiopian Berbere spice blend. Essential for Doro Wat, Siga Wat and other traditional dishes. Made from the finest spices.",
                "price": 450,
                "images": [
                    "https://images.unsplash.com/photo-1596040033229-a0b3b9b2c5e6?w=500"
                ],
                "category": "Food & Beverages",
                "subcategory": "Spices",
                "condition": "new",
                "attributes": {"weight": "500g", "organic": "Yes"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 50
            },
            {
                "title": "Ethiopian Coffee Beans - Yirgacheffe 1kg",
                "description": "Premium Yirgacheffe coffee beans from Sidamo region. Freshly roasted with fruity and floral notes. Grade A quality.",
                "price": 850,
                "images": [
                    "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500"
                ],
                "category": "Food & Beverages",
                "subcategory": "Coffee",
                "condition": "new",
                "attributes": {"weight": "1kg", "origin": "Yirgacheffe", "roast": "Medium", "grade": "A"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 35
            },
            {
                "title": "Shiro Powder - Traditional 1kg",
                "description": "Authentic Ethiopian Shiro powder made from ground chickpeas and traditional spices. Ready to cook, just add water.",
                "price": 380,
                "images": [
                    "https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=500"
                ],
                "category": "Food & Beverages",
                "subcategory": "Spices",
                "condition": "new",
                "attributes": {"weight": "1kg", "type": "Traditional"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 45
            },
            {
                "title": "Teff Flour - White Premium 2kg",
                "description": "Premium white Teff flour for making soft injera. Gluten-free and highly nutritious. Freshly milled from Ethiopian Teff.",
                "price": 520,
                "images": [
                    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500"
                ],
                "category": "Food & Beverages",
                "subcategory": "Grains & Flour",
                "condition": "new",
                "attributes": {"weight": "2kg", "type": "White Teff", "gluten-free": "Yes"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 60
            },
            {
                "title": "Mitmita Spice - Hot Pepper 250g",
                "description": "Spicy Ethiopian Mitmita seasoning blend. Perfect for Kitfo, Tibs, and as table condiment. Hot and flavorful.",
                "price": 280,
                "images": [
                    "https://images.unsplash.com/photo-1596040033229-a0b3b9b2c5e6?w=500"
                ],
                "category": "Food & Beverages",
                "subcategory": "Spices",
                "condition": "new",
                "attributes": {"weight": "250g", "spice-level": "Hot"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 55
            },
            {
                "title": "Ethiopian Honey - Wild Forest 500g",
                "description": "Pure Ethiopian wild forest honey. Raw and unprocessed. Rich flavor perfect for coffee ceremony or traditional medicine.",
                "price": 680,
                "images": [
                    "https://images.unsplash.com/photo-1587049352846-4a222e784e38?w=500"
                ],
                "category": "Food & Beverages",
                "subcategory": "Natural Foods",
                "condition": "new",
                "attributes": {"weight": "500g", "type": "Wild Forest", "raw": "Yes"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 40
            },
            # Books & Learning
            {
                "title": "Ethiopian History - Ancient to Modern",
                "description": "Comprehensive guide to Ethiopian history from the Axumite Empire to modern Ethiopia. Includes photos and maps. Bilingual English and Amharic.",
                "price": 650,
                "images": [
                    "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=500"
                ],
                "category": "Books",
                "subcategory": "History",
                "condition": "new",
                "attributes": {"pages": "420", "language": "English/Amharic"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 25
            },
            {
                "title": "Learn Amharic - Complete Guide with Audio",
                "description": "Comprehensive Amharic language learning book with audio CD. Perfect for beginners. Includes grammar, vocabulary, and cultural notes.",
                "price": 580,
                "images": [
                    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500"
                ],
                "category": "Books",
                "subcategory": "Education",
                "condition": "new",
                "attributes": {"pages": "350", "includes": "Audio CD"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 18
            },
            {
                "title": "Ethiopian Cookbook - Traditional Recipes",
                "description": "Authentic Ethiopian recipes for Doro Wat, Kitfo, Tibs, and more. Step-by-step instructions with photos.",
                "price": 480,
                "images": [
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500"
                ],
                "category": "Books",
                "subcategory": "Cooking",
                "condition": "new",
                "attributes": {"pages": "280", "language": "English"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 22
            },
            # Beauty - Ethiopian Natural Products
            {
                "title": "Shea Butter - 100% Natural Ethiopian 250g",
                "description": "Pure Ethiopian shea butter. Perfect for skin and hair care. Moisturizing and healing properties. Unrefined and organic.",
                "price": 420,
                "images": [
                    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500"
                ],
                "category": "Beauty",
                "subcategory": "Skincare",
                "condition": "new",
                "attributes": {"weight": "250g", "natural": "100%", "organic": "Yes"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 30
            },
            {
                "title": "Ethiopian Black Seed Oil - Tikur Azmud",
                "description": "Premium black seed oil (Tikur Azmud) for health and beauty. Used for hair growth and skin care. 100ml bottle.",
                "price": 380,
                "images": [
                    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500"
                ],
                "category": "Beauty",
                "subcategory": "Hair Care",
                "condition": "new",
                "attributes": {"volume": "100ml", "natural": "Yes"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 25
            },
            {
                "title": "Moringa Powder - Ethiopian Superfood 200g",
                "description": "Pure Ethiopian Moringa powder. Rich in vitamins and minerals. Perfect for smoothies and health drinks.",
                "price": 450,
                "images": [
                    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500"
                ],
                "category": "Beauty",
                "subcategory": "Health & Wellness",
                "condition": "new",
                "attributes": {"weight": "200g", "organic": "Yes"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 28
            },
            # Car
            {
                "title": "Toyota Corolla 2018 - Well Maintained",
                "description": "2018 Toyota Corolla in excellent condition. 85,000 km, automatic transmission, full AC, original paint. Single owner, all service records available.",
                "price": 1850000,
                "images": [
                    "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=500",
                    "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=500"
                ],
                "category": "Car",
                "subcategory": "Sedan",
                "condition": "used",
                "attributes": {"brand": "Toyota", "model": "Corolla", "year": "2018", "mileage": "85,000 km", "transmission": "Automatic", "fuel": "Petrol"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 1
            },
            {
                "title": "Bajaj Three-Wheeler Taxi - 2020",
                "description": "2020 Bajaj three-wheeler in good working condition. Used as taxi, low fuel consumption. Engine recently serviced.",
                "price": 320000,
                "images": [
                    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"
                ],
                "category": "Car",
                "subcategory": "Three-Wheeler",
                "condition": "used",
                "attributes": {"brand": "Bajaj", "year": "2020", "fuel": "Petrol", "type": "Taxi"},
                "location": "Addis Ababa, Merkato",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 1
            },
            {
                "title": "Car Seat Covers - Ethiopian Pattern",
                "description": "Premium quality car seat covers with Ethiopian Tibeb pattern. Universal fit for most sedans and SUVs. Easy to install and clean.",
                "price": 1200,
                "images": [
                    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500"
                ],
                "category": "Car",
                "subcategory": "Accessories",
                "condition": "new",
                "attributes": {"material": "Fabric", "pattern": "Tibeb", "fit": "Universal"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 20
            },
            # House
            {
                "title": "2-Bedroom Apartment for Rent - Bole",
                "description": "Modern 2-bedroom apartment in Bole. 24/7 security, parking, backup generator. Close to Bole International Airport and CMC road.",
                "price": 25000,
                "images": [
                    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500",
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500"
                ],
                "category": "House",
                "subcategory": "Apartment Rental",
                "condition": "new",
                "attributes": {"bedrooms": "2", "bathrooms": "1", "area": "85 sqm", "floor": "3rd", "parking": "Yes", "generator": "Yes"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 1
            },
            {
                "title": "Studio Apartment for Rent - Kazanchis",
                "description": "Cozy furnished studio apartment in Kazanchis. Ideal for singles or couples. Internet included, close to Meskel Square.",
                "price": 12000,
                "images": [
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500"
                ],
                "category": "House",
                "subcategory": "Apartment Rental",
                "condition": "new",
                "attributes": {"bedrooms": "Studio", "furnished": "Yes", "internet": "Included", "area": "45 sqm"},
                "location": "Addis Ababa, Kazanchis",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 1
            },
            {
                "title": "Commercial Space for Rent - Piazza",
                "description": "Prime commercial space in Piazza area. Ground floor, high foot traffic. Suitable for shop, office, or restaurant.",
                "price": 45000,
                "images": [
                    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500"
                ],
                "category": "House",
                "subcategory": "Commercial Rental",
                "condition": "new",
                "attributes": {"area": "120 sqm", "floor": "Ground", "type": "Commercial"},
                "location": "Addis Ababa, Piazza",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 1
            },
            # Furniture
            {
                "title": "Ethiopian Handcrafted Wooden Sofa Set",
                "description": "Handcrafted solid wood 3-piece sofa set with traditional Ethiopian carved details. Includes 3-seater, 2-seater, and 1-seater with cushions.",
                "price": 28000,
                "images": [
                    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500",
                    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500"
                ],
                "category": "Furniture",
                "subcategory": "Sofa & Living Room",
                "condition": "new",
                "attributes": {"material": "Solid Wood", "pieces": "3", "handmade": "Yes", "color": "Brown"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 5
            },
            {
                "title": "King Size Bed Frame - Solid Wood",
                "description": "Elegant king-size bed frame made from quality Ethiopian timber. Includes headboard with carved design. Mattress not included.",
                "price": 15000,
                "images": [
                    "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500"
                ],
                "category": "Furniture",
                "subcategory": "Bedroom",
                "condition": "new",
                "attributes": {"size": "King", "material": "Solid Wood", "mattress": "Not included"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 8
            },
            {
                "title": "Office Desk with Drawer - Modern",
                "description": "Modern office desk with 3 drawers and cable management. Suitable for home office or corporate use. Easy assembly.",
                "price": 6500,
                "images": [
                    "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500"
                ],
                "category": "Furniture",
                "subcategory": "Office Furniture",
                "condition": "new",
                "attributes": {"material": "MDF + Wood", "drawers": "3", "color": "Walnut"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 12
            },
            # Commercial equipment and tools
            {
                "title": "Industrial Sewing Machine - Brother",
                "description": "Heavy-duty industrial sewing machine for garment production. High-speed stitching up to 5000 rpm. Perfect for tailors and small garment factories.",
                "price": 32000,
                "images": [
                    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500"
                ],
                "category": "Commercial equipment and tools",
                "subcategory": "Sewing & Textile",
                "condition": "new",
                "attributes": {"brand": "Brother", "speed": "5000 rpm", "type": "Industrial"},
                "location": "Addis Ababa, Merkato",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 6
            },
            {
                "title": "Commercial Injera Mitad - Electric",
                "description": "Large electric Mitad for commercial injera production. 60cm diameter, fast heating, energy efficient. Used in restaurants and hotels.",
                "price": 18500,
                "images": [
                    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
                ],
                "category": "Commercial equipment and tools",
                "subcategory": "Kitchen Equipment",
                "condition": "new",
                "attributes": {"diameter": "60cm", "power": "Electric", "voltage": "220V"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 10
            },
            {
                "title": "Power Drill Set - Professional 20V",
                "description": "Professional cordless power drill set with 20V lithium battery. Includes 2 batteries, charger, and 25-piece bit set. Ideal for construction and carpentry.",
                "price": 4800,
                "images": [
                    "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500"
                ],
                "category": "Commercial equipment and tools",
                "subcategory": "Power Tools",
                "condition": "new",
                "attributes": {"brand": "ProTool", "voltage": "20V", "battery": "Lithium", "bits": "25-piece"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 15
            },
            # Health And Beauty
            {
                "title": "Argan Oil Hair Treatment - 150ml",
                "description": "100% pure Argan oil for deep hair nourishment. Reduces frizz, adds shine, and strengthens hair. Suitable for all hair types.",
                "price": 680,
                "images": [
                    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500"
                ],
                "category": "Health And Beauty",
                "subcategory": "Hair Care",
                "condition": "new",
                "attributes": {"volume": "150ml", "type": "Pure Argan Oil", "hair_type": "All types"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 30
            },
            {
                "title": "Vitamin C Serum - Brightening Formula",
                "description": "Advanced vitamin C serum for glowing, even skin tone. Reduces dark spots and fine lines. Dermatologist tested, suitable for Ethiopian skin tones.",
                "price": 950,
                "images": [
                    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500"
                ],
                "category": "Health And Beauty",
                "subcategory": "Skincare",
                "condition": "new",
                "attributes": {"volume": "30ml", "skin_type": "All types", "key_ingredient": "Vitamin C"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 25
            },
            {
                "title": "Digital Blood Pressure Monitor",
                "description": "Clinically accurate digital blood pressure monitor with large LCD display. Memory for 60 readings, irregular heartbeat detection. Includes arm cuff.",
                "price": 1800,
                "images": [
                    "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500"
                ],
                "category": "Health And Beauty",
                "subcategory": "Medical Devices",
                "condition": "new",
                "attributes": {"memory": "60 readings", "display": "LCD", "cuff": "Included"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 20
            },
            # General
            {
                "title": "School Backpack - Waterproof 30L",
                "description": "Durable waterproof backpack with laptop compartment up to 15.6 inch. Multiple pockets, ergonomic straps. Perfect for students.",
                "price": 1200,
                "images": [
                    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
                ],
                "category": "General",
                "subcategory": "Bags",
                "condition": "new",
                "attributes": {"capacity": "30L", "waterproof": "Yes", "laptop_fit": "15.6 inch"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 35
            },
            {
                "title": "Stationery Set - Office & School",
                "description": "Complete stationery set including pens, pencils, ruler, eraser, sharpener, and notebook. Ideal for school and office use.",
                "price": 280,
                "images": [
                    "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=500"
                ],
                "category": "General",
                "subcategory": "Stationery",
                "condition": "new",
                "attributes": {"pieces": "15", "type": "School & Office"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 60
            },
            {
                "title": "Reusable Shopping Bags - Set of 5",
                "description": "Eco-friendly reusable shopping bags made from natural cotton. Foldable, washable, and strong. Printed with Ethiopian motifs.",
                "price": 350,
                "images": [
                    "https://images.unsplash.com/photo-1533090368676-1fd25485db88?w=500"
                ],
                "category": "General",
                "subcategory": "Household",
                "condition": "new",
                "attributes": {"pieces": "5", "material": "Cotton", "eco_friendly": "Yes"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 50
            },
            # Art And Craft
            {
                "title": "Ethiopian Cross - Handcrafted Silver",
                "description": "Beautiful handcrafted Ethiopian Orthodox cross made from silver. Traditional design from Lalibela artisans. Perfect as gift or home decoration.",
                "price": 3200,
                "images": [
                    "https://images.unsplash.com/photo-1533090368676-1fd25485db88?w=500"
                ],
                "category": "Art And Craft",
                "subcategory": "Religious Art",
                "condition": "new",
                "attributes": {"material": "Silver", "origin": "Lalibela", "handmade": "Yes"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 10
            },
            {
                "title": "Handwoven Basket - Decorative Wall Art",
                "description": "Stunning handwoven Ethiopian basket with traditional patterns and vibrant colors. Used as wall art or storage. 45cm diameter.",
                "price": 1400,
                "images": [
                    "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=500"
                ],
                "category": "Art And Craft",
                "subcategory": "Weaving & Baskets",
                "condition": "new",
                "attributes": {"diameter": "45cm", "handmade": "Yes", "material": "Natural fiber"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 14
            },
            {
                "title": "Acrylic Paint Set - 24 Colors",
                "description": "Professional-grade acrylic paint set with 24 vibrant colors. Non-toxic and fast-drying. Ideal for canvas, wood, and fabric painting.",
                "price": 850,
                "images": [
                    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500"
                ],
                "category": "Art And Craft",
                "subcategory": "Painting Supplies",
                "condition": "new",
                "attributes": {"colors": "24", "type": "Acrylic", "non_toxic": "Yes"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 22
            },
            # Services
            {
                "title": "Professional Photography - Events",
                "description": "Professional event photography for weddings, graduations, and corporate events. Includes editing, USB delivery, and online gallery. Serving Addis Ababa.",
                "price": 8000,
                "images": [
                    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500"
                ],
                "category": "Services",
                "subcategory": "Photography",
                "condition": "new",
                "attributes": {"type": "Event Photography", "includes": "Editing + Gallery", "location": "Addis Ababa"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 10
            },
            {
                "title": "Home Cleaning Service - Full Package",
                "description": "Professional home cleaning service. Deep cleaning for apartments and villas. Includes kitchen, bathrooms, bedrooms, and living areas. Eco-friendly products.",
                "price": 1500,
                "images": [
                    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500"
                ],
                "category": "Services",
                "subcategory": "Home Services",
                "condition": "new",
                "attributes": {"type": "Deep Cleaning", "eco_friendly": "Yes", "duration": "4-6 hours"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 20
            },
            {
                "title": "Private Amharic Tutoring - Online & In-Person",
                "description": "Experienced Amharic language tutor offering private lessons. Beginner to advanced. Flexible schedule, both online and in-person sessions available.",
                "price": 500,
                "images": [
                    "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=500"
                ],
                "category": "Services",
                "subcategory": "Tutoring",
                "condition": "new",
                "attributes": {"type": "Language Tutoring", "language": "Amharic", "mode": "Online & In-Person", "per": "session"},
                "location": "Addis Ababa, Bole",
                "seller_id": user_ids["shop@vibeyworld.com"],
                "seller_name": "Vibey World Market",
                "stock": 30
            }
        ]
        
        product_ids = []
        for product_data in products_data:
            product_id = Product.create(product_data)
            # Approve all products for seeding
            Product.update(product_id, {"is_approved": True})
            product_ids.append(product_id)
            print(f"   ✓ Created product: {product_data['title']}")
        
        print(f"✅ Created {len(products_data)} products")
        return product_ids

def seed_reviews(user_ids, product_ids):
    """Create sample reviews"""
    with app.app_context():
        print("⭐ Creating reviews...")
        
        reviews_data = [
            {
                "product_id": product_ids[0],
                "seller_id": user_ids["shop@vibeyworld.com"],
                "buyer_id": user_ids["kidus@example.com"],
                "buyer_name": "Kidus Tesfaye",
                "rating": 5,
                "comment": "ደስ የሚል ልብስ! Beautiful Habesha Kemis! Perfect for my sister's wedding. The embroidery is stunning!"
            },
            {
                "product_id": product_ids[0],
                "seller_id": user_ids["shop@vibeyworld.com"],
                "buyer_id": user_ids["sara@example.com"],
                "buyer_name": "Sara Alemayehu",
                "rating": 5,
                "comment": "Absolutely beautiful! The quality is excellent and the Tibeb work is detailed. Highly recommend Vibey World!"
            },
            {
                "product_id": product_ids[1],
                "seller_id": user_ids["shop@vibeyworld.com"],
                "buyer_id": user_ids["daniel@example.com"],
                "buyer_name": "Daniel Haile",
                "rating": 5,
                "comment": "Perfect traditional suit! Wore it for Easter celebration. Everyone loved it. Great shop!"
            },
            {
                "product_id": product_ids[5],
                "seller_id": user_ids["shop@vibeyworld.com"],
                "buyer_id": user_ids["kidus@example.com"],
                "buyer_name": "Kidus Tesfaye",
                "rating": 5,
                "comment": "Great headphones! Perfect for my commute in Addis. Battery lasts all day."
            },
            {
                "product_id": product_ids[6],
                "seller_id": user_ids["shop@vibeyworld.com"],
                "buyer_id": user_ids["bethlehem@example.com"],
                "buyer_name": "Bethlehem Girma",
                "rating": 5,
                "comment": "Love this smartwatch! Amharic support is perfect. Tracks my runs well. Fast delivery from Vibey World!"
            },
            {
                "product_id": product_ids[10],
                "seller_id": user_ids["shop@vibeyworld.com"],
                "buyer_id": user_ids["sara@example.com"],
                "buyer_name": "Sara Alemayehu",
                "rating": 5,
                "comment": "በጣም ጥሩ! Beautiful Jebena set! Perfect for coffee ceremony. Guests always compliment it."
            },
            {
                "product_id": product_ids[11],
                "seller_id": user_ids["shop@vibeyworld.com"],
                "buyer_id": user_ids["daniel@example.com"],
                "buyer_name": "Daniel Haile",
                "rating": 5,
                "comment": "Great Mesob! High quality weaving. Perfect size for family gatherings. Thank you Vibey World!"
            },
            {
                "product_id": product_ids[15],
                "seller_id": user_ids["shop@vibeyworld.com"],
                "buyer_id": user_ids["kidus@example.com"],
                "buyer_name": "Kidus Tesfaye",
                "rating": 5,
                "comment": "Best Berbere I've found in Addis! Authentic taste for my Doro Wat. Will order again!"
            },
            {
                "product_id": product_ids[16],
                "seller_id": user_ids["shop@vibeyworld.com"],
                "buyer_id": user_ids["bethlehem@example.com"],
                "buyer_name": "Bethlehem Girma",
                "rating": 5,
                "comment": "Excellent Yirgacheffe beans! Fresh roast, amazing aroma. Best coffee shop in town!"
            },
            {
                "product_id": product_ids[20],
                "seller_id": user_ids["shop@vibeyworld.com"],
                "buyer_id": user_ids["meron@example.com"],
                "buyer_name": "Meron Tadesse",
                "rating": 5,
                "comment": "Great Ethiopian history book! Very informative with beautiful photos. Bilingual is perfect."
            },
            {
                "product_id": product_ids[23],
                "seller_id": user_ids["shop@vibeyworld.com"],
                "buyer_id": user_ids["sara@example.com"],
                "buyer_name": "Sara Alemayehu",
                "rating": 5,
                "comment": "Amazing shea butter! So pure and moisturizing. My skin has never felt better."
            },
            {
                "product_id": product_ids[19],
                "seller_id": user_ids["shop@vibeyworld.com"],
                "buyer_id": user_ids["yohannes@example.com"],
                "buyer_name": "Yohannes Kebede",
                "rating": 5,
                "comment": "Pure Ethiopian honey! Tastes amazing with coffee. Worth every birr!"
            }
        ]
        
        for review_data in reviews_data:
            Review.create(review_data)
            print(f"   ✓ Created review for product")
        
        print(f"✅ Created {len(reviews_data)} reviews")

def seed_orders(user_ids, product_ids):
    """Create sample orders"""
    with app.app_context():
        print("🛒 Creating orders...")
        
        orders_data = [
            {
                "buyer_id": user_ids["kidus@example.com"],
                "seller_id": user_ids["shop@vibeyworld.com"],
                "items": [
                    {
                        "product_id": product_ids[0],
                        "title": "Habesha Kemis - White with Gold Tibeb",
                        "price": 4500,
                        "qty": 1,
                        "image": "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=500"
                    }
                ],
                "total": 4500,
                "payment_method": "cash_on_delivery",
                "payment_status": "paid",
                "status": "delivered",
                "shipping_address": {
                    "name": "Kidus Tesfaye",
                    "phone": "+251977890123",
                    "address": "CMC, Near Sheger Building",
                    "city": "Addis Ababa"
                },
                "notes": "Please call 30 minutes before delivery"
            },
            {
                "buyer_id": user_ids["sara@example.com"],
                "seller_id": user_ids["shop@vibeyworld.com"],
                "items": [
                    {
                        "product_id": product_ids[5],
                        "title": "Wireless Bluetooth Headphones",
                        "price": 2500,
                        "qty": 1,
                        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
                    },
                    {
                        "product_id": product_ids[7],
                        "title": "Solar Power Bank 20000mAh",
                        "price": 1200,
                        "qty": 1,
                        "image": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500"
                    }
                ],
                "total": 3700,
                "payment_method": "cash_on_delivery",
                "payment_status": "paid",
                "status": "shipped",
                "shipping_address": {
                    "name": "Sara Alemayehu",
                    "phone": "+251988901234",
                    "address": "Bahir Dar, Near Blue Nile Hotel",
                    "city": "Bahir Dar"
                }
            },
            {
                "buyer_id": user_ids["daniel@example.com"],
                "seller_id": user_ids["shop@vibeyworld.com"],
                "items": [
                    {
                        "product_id": product_ids[11],
                        "title": "Running Shoes - Ethiopian Marathon Edition",
                        "price": 1800,
                        "qty": 1,
                        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
                    }
                ],
                "total": 1800,
                "payment_method": "cash_on_delivery",
                "payment_status": "pending",
                "status": "confirmed",
                "shipping_address": {
                    "name": "Daniel Haile",
                    "phone": "+251999012345",
                    "address": "Hawassa, Piassa Area",
                    "city": "Hawassa"
                },
                "notes": "Training for Great Ethiopian Run!"
            },
            {
                "buyer_id": user_ids["kidus@example.com"],
                "seller_id": user_ids["shop@vibeyworld.com"],
                "items": [
                    {
                        "product_id": product_ids[13],
                        "title": "Ethiopian Incense - Etan (5 Boxes)",
                        "price": 350,
                        "qty": 2,
                        "image": "https://images.unsplash.com/photo-1602874801006-926d55607566?w=500"
                    },
                    {
                        "product_id": product_ids[10],
                        "title": "Ethiopian Coffee Ceremony Set - Jebena",
                        "price": 1500,
                        "qty": 1,
                        "image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500"
                    }
                ],
                "total": 2200,
                "payment_method": "cash_on_delivery",
                "payment_status": "paid",
                "status": "delivered",
                "shipping_address": {
                    "name": "Kidus Tesfaye",
                    "phone": "+251977890123",
                    "address": "CMC, Near Sheger Building",
                    "city": "Addis Ababa"
                }
            },
            {
                "buyer_id": user_ids["bethlehem@example.com"],
                "seller_id": user_ids["shop@vibeyworld.com"],
                "items": [
                    {
                        "product_id": product_ids[15],
                        "title": "Berbere Spice Mix - Premium 500g",
                        "price": 450,
                        "qty": 2,
                        "image": "https://images.unsplash.com/photo-1596040033229-a0b3b9b2c5e6?w=500"
                    },
                    {
                        "product_id": product_ids[16],
                        "title": "Ethiopian Coffee Beans - Yirgacheffe 1kg",
                        "price": 850,
                        "qty": 1,
                        "image": "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500"
                    },
                    {
                        "product_id": product_ids[18],
                        "title": "Teff Flour - White Premium 2kg",
                        "price": 520,
                        "qty": 1,
                        "image": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500"
                    }
                ],
                "total": 2270,
                "payment_method": "cash_on_delivery",
                "payment_status": "pending",
                "status": "pending",
                "shipping_address": {
                    "name": "Bethlehem Girma",
                    "phone": "+251911567890",
                    "address": "Dire Dawa, Near Railway Station",
                    "city": "Dire Dawa"
                },
                "notes": "Making Doro Wat for the family! Need it before Sunday."
            },
            {
                "buyer_id": user_ids["sara@example.com"],
                "seller_id": user_ids["shop@vibeyworld.com"],
                "items": [
                    {
                        "product_id": product_ids[1],
                        "title": "Men's Habesha Libs - Traditional Suit",
                        "price": 3800,
                        "qty": 1,
                        "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500"
                    },
                    {
                        "product_id": product_ids[2],
                        "title": "Netela - Ethiopian Traditional Scarf",
                        "price": 850,
                        "qty": 2,
                        "image": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500"
                    }
                ],
                "total": 5500,
                "payment_method": "cash_on_delivery",
                "payment_status": "pending",
                "status": "pending",
                "shipping_address": {
                    "name": "Sara Alemayehu",
                    "phone": "+251988901234",
                    "address": "Bahir Dar, Near Blue Nile Hotel",
                    "city": "Bahir Dar"
                },
                "notes": "Gift for my father's birthday"
            },
            {
                "buyer_id": user_ids["meron@example.com"],
                "seller_id": user_ids["shop@vibeyworld.com"],
                "items": [
                    {
                        "product_id": product_ids[11],
                        "title": "Mesob - Ethiopian Basket Table",
                        "price": 2200,
                        "qty": 1,
                        "image": "https://images.unsplash.com/photo-1585328862881-c0693a7ad9b6?w=500"
                    },
                    {
                        "product_id": product_ids[19],
                        "title": "Ethiopian Honey - Wild Forest 500g",
                        "price": 680,
                        "qty": 2,
                        "image": "https://images.unsplash.com/photo-1587049352846-4a222e784e38?w=500"
                    }
                ],
                "total": 3560,
                "payment_method": "cash_on_delivery",
                "payment_status": "paid",
                "status": "delivered",
                "shipping_address": {
                    "name": "Meron Tadesse",
                    "phone": "+251933456789",
                    "address": "Merkato, Near Arada",
                    "city": "Addis Ababa"
                }
            }
        ]
        
        for order_data in orders_data:
            Order.create(order_data)
            print(f"   ✓ Created order for {order_data['shipping_address']['name']}")
        
        print(f"✅ Created {len(orders_data)} orders")

def seed_messages(user_ids):
    """Create sample messages"""
    with app.app_context():
        print("💬 Creating messages...")
        
        messages_data = [
            {
                "sender_id": user_ids["kidus@example.com"],
                "receiver_id": user_ids["shop@vibeyworld.com"],
                "text": "ሰላም! Is the Habesha Kemis still available? I need it for a wedding next week.",
            },
            {
                "sender_id": user_ids["shop@vibeyworld.com"],
                "receiver_id": user_ids["kidus@example.com"],
                "text": "Selam! Yes, we have it in stock. The gold embroidery is beautiful. Free size fits most people. We can deliver to CMC area.",
            },
            {
                "sender_id": user_ids["kidus@example.com"],
                "receiver_id": user_ids["shop@vibeyworld.com"],
                "text": "Perfect! I'll order it now. Thank you!",
            },
            {
                "sender_id": user_ids["sara@example.com"],
                "receiver_id": user_ids["shop@vibeyworld.com"],
                "text": "Do you ship to Bahir Dar? Interested in the headphones and power bank.",
            },
            {
                "sender_id": user_ids["shop@vibeyworld.com"],
                "receiver_id": user_ids["sara@example.com"],
                "text": "Yes, we ship nationwide! Delivery takes 2-3 days to Bahir Dar. All electronics come with warranty.",
            },
            {
                "sender_id": user_ids["daniel@example.com"],
                "receiver_id": user_ids["shop@vibeyworld.com"],
                "text": "Do you have the running shoes in size 43? I'm training for Great Ethiopian Run.",
            },
            {
                "sender_id": user_ids["shop@vibeyworld.com"],
                "receiver_id": user_ids["daniel@example.com"],
                "text": "Yes! We have size 43. Great choice for training! Very comfortable and durable.",
            },
            {
                "sender_id": user_ids["kidus@example.com"],
                "receiver_id": user_ids["shop@vibeyworld.com"],
                "text": "The Jebena set is beautiful! Does it include the Rekebot stand?",
            },
            {
                "sender_id": user_ids["shop@vibeyworld.com"],
                "receiver_id": user_ids["kidus@example.com"],
                "text": "Thank you! Yes, the complete set includes 6 cups, saucer, incense burner and all accessories for coffee ceremony.",
            },
            {
                "sender_id": user_ids["bethlehem@example.com"],
                "receiver_id": user_ids["shop@vibeyworld.com"],
                "text": "Is your Berbere spicy? I want authentic taste for Doro Wat.",
            },
            {
                "sender_id": user_ids["shop@vibeyworld.com"],
                "receiver_id": user_ids["bethlehem@example.com"],
                "text": "Yes! It's traditional recipe with perfect spice level for Doro Wat. Many customers love it! We also have Shiro and Mitmita.",
            },
            {
                "sender_id": user_ids["sara@example.com"],
                "receiver_id": user_ids["shop@vibeyworld.com"],
                "text": "Can you help me choose a gift for my father? He likes traditional items.",
            },
            {
                "sender_id": user_ids["shop@vibeyworld.com"],
                "receiver_id": user_ids["sara@example.com"],
                "text": "Of course! The Habesha Libs suit is very popular for fathers. We also have beautiful Netela scarves. Both are handmade quality.",
            },
            {
                "sender_id": user_ids["meron@example.com"],
                "receiver_id": user_ids["shop@vibeyworld.com"],
                "text": "Do you have fresh Yirgacheffe coffee? Looking for the best quality.",
            },
            {
                "sender_id": user_ids["shop@vibeyworld.com"],
                "receiver_id": user_ids["meron@example.com"],
                "text": "Yes! We have Grade A Yirgacheffe beans, freshly roasted. Amazing fruity and floral notes. Best coffee in Addis!",
            }
        ]
        
        for msg_data in messages_data:
            Message.send(msg_data)
            print(f"   ✓ Created message")
        
        print(f"✅ Created {len(messages_data)} messages")

def run_seed():
    """Main function to seed all data"""
    print("\n🌱 Starting database seeding...\n")
    
    clear_database()
    user_ids = seed_users()
    product_ids = seed_products(user_ids)
    seed_reviews(user_ids, product_ids)
    seed_orders(user_ids, product_ids)
    seed_messages(user_ids)
    
    print("\n✨ Database seeding completed successfully!\n")
    print("📝 Sample Login Credentials:")
    print("   Admin: admin@vibeyworld.com / admin123")
    print("   Shop: shop@vibeyworld.com / seller123")
    print("   Customer: kidus@example.com / buyer123")
    print("   Customer: sara@example.com / buyer123")
    print("\n🇪🇹 Vibey World Market - Ethiopian marketplace data loaded!")
    print("📍 Location: Addis Ababa, Bole")
    print("🛍️  Products: Traditional wear, electronics, food, coffee, spices, and more!")
    print()

if __name__ == "__main__":
    run_seed()
