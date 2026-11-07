# 🌸 Sai Pootharekulu – Premium E-Commerce Website

A luxurious, full-stack, responsive traditional Indian sweets e-commerce platform crafted exclusively for **Sai Pootharekulu**.

Designed with a rich royal emerald green and golden theme, honoring Andhra Pradesh's timeless culinary heritage with modern e-commerce engineering.

---

## 📸 Brand Visual Reference & Identity
- **Official Brand Name:** Sai Pootharekulu
- **Official Owner Contact / WhatsApp:** 9441321874
- **Address:** Chandhana Residency, Kudlu Gate, Room No. 7, Electronic City, Bengaluru, Karnataka - 560068
- **Primary Color Palette:**
  - Dark Emerald Green (`#041f14`, `#062b1c`, `#073522`)
  - Royal Metallic Gold Gradients (`#d4af37`, `#fcf6ba`, `#b89028`)
  - Warm Ivory & Cream (`#fdfbf7`, `#f7f1e5`)

---

## 📂 Complete Project Folder Structure

```
Sai-Pootharekulu/
├── client/                               # Frontend Application (React + Vite + Tailwind CSS)
│   ├── public/
│   │   ├── sai-pootharekulu-logo.jpg     # Official Logo
│   │   ├── sai-pootharekulu-poster.jpg   # Official Promotional Poster
│   ├── src/
│   │   ├── assets/                       # Custom graphic assets
│   │   ├── components/                   # Reusable UI Components
│   │   │   ├── Navbar.jsx                # Sticky Heritage Navigation with Cart Badge
│   │   │   ├── Footer.jsx                # Luxury Footer with Official Details & Map Link
│   │   │   ├── Hero.jsx                  # Hero Section with Poster Showcase & Taglines
│   │   │   ├── ProductCard.jsx           # Premium Sweet Card with Qty Selector
│   │   │   ├── CartDrawer.jsx            # Slide-in Interactive Cart Drawer
│   │   │   ├── AboutSection.jsx          # Heritage Storytelling & Core Pillars
│   │   │   ├── FeaturesSection.jsx       # 4 Pillars of Purity & Taste
│   │   │   ├── ContactSection.jsx        # Clickable Phone, WhatsApp, Maps & Inquiry Form
│   │   │   ├── TraditionalMotif.jsx      # Gold Lotus Motifs & Corner Flourishes
│   │   │   ├── ProtectedRoute.jsx        # Customer Route Guard
│   │   │   └── AdminRoute.jsx            # Administrator Security Guard
│   │   ├── context/
│   │   │   ├── AuthContext.jsx           # JWT Authentication & User Session Provider
│   │   │   └── CartContext.jsx           # Reactive Cart Calculation & State Provider
│   │   ├── pages/
│   │   │   ├── HomePage.jsx              # Landing Page with Hero, Menu, About, Contact
│   │   │   ├── MenuPage.jsx              # Full Sweet Menu with All 4 Pack Variations
│   │   │   ├── LoginPage.jsx             # Customer / Admin Login with Show/Hide Password
│   │   │   ├── SignupPage.jsx            # Validated Registration Page
│   │   │   ├── ForgotPasswordPage.jsx    # Self-Service Password Reset
│   │   │   ├── CheckoutPage.jsx          # Multi-Step UPI & Delivery Address Checkout
│   │   │   ├── OrderSuccessPage.jsx      # Animated Success Checkmark & WhatsApp Dispatch
│   │   │   ├── MyOrdersPage.jsx          # Customer Past Orders & Tracking
│   │   │   └── AdminDashboardPage.jsx    # Owner Portal: Orders, Status, Products, Stats
│   │   ├── services/
│   │   │   └── api.js                    # Axios API Client with JWT Interceptors
│   │   ├── App.jsx                       # Master Routing and Layout Component
│   │   ├── main.jsx                      # React Root Mounting
│   │   └── index.css                     # Custom Luxury Gold & Emerald Tailwind Directives
│   ├── index.html                        # HTML5 Template with Fonts & Razorpay SDK
│   ├── package.json                      # Frontend Dependencies
│   ├── tailwind.config.js                # Custom Gold & Emerald Palette Configurations
│   ├── postcss.config.js
│   ├── vite.config.js                    # Vite Dev Server with Proxy to Backend
│   └── .env                              # Frontend Environment Variables
│
├── server/                               # Backend Application (Node.js + Express + MongoDB)
│   ├── config/
│   │   └── db.js                         # MongoDB Connection with Auto In-Memory Fallback
│   ├── controllers/
│   │   ├── authController.js             # Customer Register, Login, Profile & Reset
│   │   ├── productController.js          # Product Catalog Retrieval
│   │   ├── orderController.js            # Order Placement, Calculation, User Orders
│   │   ├── paymentController.js          # Razorpay Order, HMAC Signature Verification, Webhooks
│   │   ├── adminController.js            # Admin Stats, Order Status Updates, Customer List
│   │   └── contactController.js          # Customer Inquiries & Feedback
│   ├── middleware/
│   │   ├── authMiddleware.js             # Bearer JWT Verification & Admin Role Checks
│   │   └── errorHandler.js               # Centralized 404 & 500 JSON Error Handling
│   ├── models/
│   │   ├── User.js                       # Customer & Admin Schema with bcrypt Hashing
│   │   ├── Product.js                    # Sweet Product Schema with Pack Sizes & Prices
│   │   ├── Order.js                      # Order Details, UPI Payment Result & WhatsApp Logs
│   │   └── ContactMessage.js             # Customer Inquiries Model
│   ├── routes/
│   │   ├── authRoutes.js                 # /api/auth routes
│   │   ├── productRoutes.js              # /api/products routes
│   │   ├── orderRoutes.js                # /api/orders routes
│   │   ├── paymentRoutes.js              # /api/payment routes
│   │   ├── adminRoutes.js                # /api/admin routes
│   │   └── contactRoutes.js              # /api/contact routes
│   ├── services/
│   │   ├── razorpayService.js            # Razorpay Order SDK & Cryptographic Signature Check
│   │   └── whatsappService.js            # WhatsApp Business Cloud API & Direct Link Generator
│   ├── seeder/
│   │   └── seedData.js                   # Auto-seeder for 4 Variations & Admin User
│   ├── server.js                         # Express Server Entry Point
│   ├── package.json                      # Backend Dependencies
│   └── .env                              # Backend Environment Configuration
│
├── .env.example                          # Environment Variables Reference Template
├── package.json                          # Root Concurrent Orchestrator
└── README.md                             # Documentation & Setup Guide
```

---

## 🍬 Product Variations & Pricing

The platform showcases all four specific product variations separately:

| # | Sweet Variant | Pack Size | Price | Key Highlights |
|---|---------------|-----------|-------|----------------|
| **1** | Jaggery Pootharekulu (Bellam) | **6 Pieces** | **₹180** | Pure Desi Ghee & Organic Bellam |
| **2** | Jaggery Pootharekulu (Bellam) | **12 Pieces** | **₹349** | Family Value Box |
| **3** | Dry Fruit Pootharekulu | **6 Pieces** | **₹180** | Loaded Pistachios, Cashews, Almonds |
| **4** | Dry Fruit Pootharekulu | **12 Pieces** | **₹349** | Royal Grand Celebration Pack |

---

## ⚡ Quick Start: Exact Windows PowerShell Commands

Open Windows PowerShell in the project directory (`c:\Users\chint\OneDrive\Desktop\Business`) and execute:

### Step 1: Install Server Dependencies
```powershell
cd server
npm install
```

### Step 2: Install Client Dependencies
```powershell
cd ..\client
npm install
```

### Step 3: Run the Application

In **Terminal 1** (Start Backend Server):
```powershell
cd server
npm run dev
```
> *The backend server will run on `http://localhost:5000` and automatically seed the 4 sweet product variations and the default admin user!*

In **Terminal 2** (Start Frontend Client):
```powershell
cd client
npm run dev
```
> *Open your browser at `http://localhost:5173` to experience the website!*

---

## 🔐 Default Credentials

### Administrator Login (For Store Owner):
- **URL:** `http://localhost:5173/login` or `http://localhost:5173/admin`
- **Email:** `admin@saipootharekulu.com`
- **Password:** `admin123`
- **Phone:** `9441321874`

---

## 💳 Razorpay Payment Gateway Setup

1. Sign up or log into [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Navigate to **Account & Settings** -> **API Keys**.
3. Generate **Key ID** and **Key Secret** (You can start in *Test Mode*).
4. Update `server/.env` and `client/.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_YourKeyIdHere
   RAZORPAY_KEY_SECRET=YourKeySecretHere
   ```
5. When `rzp_test_...` credentials are entered, the checkout automatically presents the official Razorpay Checkout popup supporting **Google Pay, PhonePe, Paytm, BHIM UPI, and NetBanking**.
6. The backend verifies the cryptographic HMAC SHA-256 signature (`crypto.createHmac('sha256', secret)`) to ensure the payment is genuinely captured before marking the order as paid.

---

## 📲 Owner WhatsApp Notifications (9441321874)

Whenever an order is placed and payment is verified, the system dispatches an instant order notification to the official owner (**9441321874**).

### Message Format Dispatched:
```
🎉 NEW ORDER – SAI POOTHAREKULU

Order ID: #SP1001
Customer: John Doe
Phone: 9876543210
Email: john@example.com

Products:
1. Jaggery Pootharekulu (Bellam) – 6 Pieces – ₹180 × 2 = ₹360
2. Dry Fruit Pootharekulu – 12 Pieces – ₹349 × 1 = ₹349

Subtotal: ₹709
Delivery Charges: ₹0
Total Paid: ₹709

Payment Status: SUCCESSFUL
Payment ID: pay_xxxxxxxx

Delivery Address:
Flat 204, Royal Palms, Kudlu Gate, Electronic City, Bengaluru, Karnataka - 560068

Order Time: 07/11/2026, 09:30:00 AM
---
Sai Pootharekulu - Authentic Andhra Delicacy
```

### WhatsApp Business Cloud API Configuration (Meta):
1. Create an app in [Meta for Developers](https://developers.facebook.com/).
2. Select **WhatsApp** -> **API Setup**.
3. Copy **Phone number ID** and **Temporary or Permanent System User Access Token**.
4. Configure in `server/.env`:
   ```env
   WHATSAPP_PHONE_NUMBER_ID=123456789012345
   WHATSAPP_ACCESS_TOKEN=EAAG...YourMetaToken
   ```
5. *Fallback / Direct Link Feature:* Even before setting up Meta API tokens, the application automatically constructs a 1-click WhatsApp message link directly to `9441321874`, accessible on both the Order Success page and the Admin Dashboard!

---

## 🧪 Step-by-Step Testing Guide

1. **User Registration:**
   - Go to `/signup`.
   - Enter Full Name, Email, 10-digit Phone, Password, and matching Confirm Password.
   - Click "Create Account" -> You are logged in and redirected to `/menu`.
2. **Shopping Cart:**
   - Select either **Jaggery Pootharekulu** or **Dry Fruit Pootharekulu** in 6 Pcs or 12 Pcs boxes.
   - Use `+` and `-` quantity selectors.
   - Click "Add to Cart" -> The luxury emerald-gold slide-out cart opens.
   - Notice the dynamic free delivery calculation and live subtotal update.
3. **Checkout & Payment Verification:**
   - Click "Proceed to Checkout".
   - Review or edit your delivery address (Street, Landmark, City, State, Pincode).
   - Click "Pay with UPI".
   - The transaction is verified cryptographically by the backend.
4. **Order Success & Owner Notification:**
   - View the animated green & gold success checkmark and confetti celebration.
   - Inspect the Order ID (`#SP1001`), payment status (`SUCCESSFUL`), and customer summary.
   - Click the "Notify Owner on WhatsApp" button to verify the message dispatched to `9441321874`.
5. **Admin Dashboard:**
   - Login as `admin@saipootharekulu.com` / `admin123`.
   - Visit `/admin`.
   - View Total Sales, Live Orders list, Registered Customers, and update any order status (e.g. *Preparing*, *Ready for Delivery*, *Delivered*).
   - Update prices or inventory stock quantities.

