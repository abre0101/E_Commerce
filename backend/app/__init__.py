from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_pymongo import PyMongo
from config import Config

mongo = PyMongo()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": "*"}})
    mongo.init_app(app)
    jwt.init_app(app)

    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok"}), 200

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.products import products_bp
    from app.routes.sellers import sellers_bp
    from app.routes.admin import admin_bp
    from app.routes.orders import orders_bp
    from app.routes.messages import messages_bp
    from app.routes.categories import categories_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(products_bp, url_prefix="/api/products")
    app.register_blueprint(sellers_bp, url_prefix="/api/sellers")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(orders_bp, url_prefix="/api/orders")
    app.register_blueprint(messages_bp, url_prefix="/api/messages")
    app.register_blueprint(categories_bp, url_prefix="/api/categories")

    return app
