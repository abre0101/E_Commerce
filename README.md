# 🌍 Vibey World Market

A full-stack multi-vendor marketplace for Ethiopia, built with React, Flask, and MongoDB.

## Tech Stack
- **Frontend**: React 18 + Vite + Zustand + React Router
- **Backend**: Flask + Flask-JWT-Extended + PyMongo
- **Database**: MongoDB
- **Payments**: Telebirr, CBE Birr, Bank Transfer, Cash on Delivery

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # fill in your values
python run.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features
- Multi-vendor marketplace with buyer/seller/admin roles
- Product listings with search, filters, sorting
- Seller dashboard with analytics
- Admin panel with product approval & user management
- Real-time messaging between buyers and sellers
- Wishlist, reviews & ratings
- Cart & checkout with local payment methods
- Mobile-responsive design
