# 🚀 OrderFlow Backend - Real-Time Order Management System

A complete backend system with **JWT Authentication**, **Stripe/PayPal Payment**, **Real-time Socket.io Updates**, and **AI Chatbot** integration.

---

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Payment Integration](#payment-integration)
- [Socket.io Events](#socketio-events)
- [AI Chatbot](#ai-chatbot)
- [Webhook Testing](#webhook-testing)
- [Deployment](#deployment)

---

## ✨ Features

✅ **User Authentication** (JWT + bcrypt)  
✅ **Order Management** (Create, Update, Track)  
✅ **Payment Integration** (Stripe )  
✅ **Real-time Updates** (Socket.io)  
✅ **AI Chatbot** (Product recommendations & FAQs)  
✅ **Payment Webhooks** (Secure payment verification)  
✅ **Admin Dashboard** (Order status management)  
✅ **Role-based Access Control**  
✅ **Input Validation** (Zod)  
✅ **Centralized Error Handling**

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **TypeScript** | Type safety |
| **Prisma ORM** | Database ORM |
| **PostgreSQL** | Primary database |
| **Socket.io** | Real-time communication |
| **Stripe** | Payment processing |
| **PayPal** | Alternative payment |
| **JWT** | Authentication |
| **bcrypt** | Password hashing |
| **Zod** | Validation |
| **HuggingFace API** | AI chatbot (free) |


## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn
- Stripe Account
- PayPal Developer Account (optional)
- HuggingFace API Token (free)

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/orderflow-backend.git
cd orderflow-backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/orderflow_db"

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret


# AI Chatbot
OPEN_ROUTER_API_KEY=hf_your_huggingface_api_token

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
```

---

## 🗄️ Database Setup

### Step 1: Generate Prisma Client
```bash
npx prisma generate
```

### Step 2: Run Migrations
```bash
npx prisma migrate dev --name init
```

### Step 3: Seed Database (Optional)
```bash
npx prisma db seed
```

### View Database
```bash
npx prisma studio
```

---

## ▶️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

Server will run on: `http://localhost:5000`

---

## 📡 API Endpoints

### Authentication

#### Register User
```http
POST /api/v1/user/create-user
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

### Orders

#### Create Order
```http
POST /api/v1/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "title": "Gaming Keyboard",
      "price": 120,
      "quantity": 1
    }
  ],
  "paymentMethod": "stripe"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_id",
    "totalAmount": 120,
    "paymentStatus": "pending",
    "orderStatus": "pending"
  },
  "paymentData": {
    "clientSecret": "pi_xxx_secret_xxx"
  }
}
```

#### Get User Orders
```http
GET api/v1/orders/my-orders
Authorization: Bearer <token>
```



---

### Admin Endpoints

#### Update Order Status
```http
PATCH /api/orders/:orderId/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "orderStatus": "shipped"
}
```

---

### Chatbot

#### Chat with AI
```http
POST /api/v1/open-ai/chat
Content-Type: application/json

{
  "message": "Which keyboard is best for gaming?"
}
```

**Response:**
```json
{
  "success": true,
  "reply": "The Gaming Keyboard X500 is highly recommended for fast response times and RGB lighting."
}
```

---

## 💳 Payment Integration

### Stripe Flow

1. **Frontend**: Create order → Get `clientSecret`
2. **Frontend**: Use Stripe.js to complete payment
3. **Backend**: Stripe webhook confirms payment
4. **Backend**: Update order status & notify via Socket.io


## 🔌 Socket.io Events

### Client Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

### Server Events

#### Order Update
```javascript
socket.on('orderUpdate', (data) => {
  console.log('Order updated:', data);
  
});
```

#### Payment Success
```javascript
socket.on('paymentSuccess', (data) => {
  console.log('Payment confirmed:', data);
});
```

---


### Alternative Free AI Models
- DeepSeek Free API
- Groq Free LLaMA 3.1
- OpenRouter free tier

---

## 🪝 Webhook Testing

### Stripe Webhook Testing

#### Step 1: Install Stripe CLI
```bash
# Windows
scoop install stripe

# Mac
brew install stripe/stripe-cli/stripe
```

#### Step 2: Login
```bash
stripe login
```

#### Step 3: Forward Webhooks
```bash
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```

#### Step 4: Get Webhook Secret
Copy the webhook signing secret and add to `.env`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

#### Step 5: Trigger Test Event
```bash
stripe trigger payment_intent.succeeded
```

---


## 🚀 Deployment



## 📮 Postman Collection

Import the Postman collection from:
```
/postman/OrderFlow-API.postman_collection.json
```

Or click here: [Run in Postman](https://www.postman.com/collections/your-collection-link)

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

---

## 👨‍💻 Author

**Your Name**  
📧 Email: devrakib2@gmail.com  
🔗 GitHub: [@https://github.com/rakibul561](https://github.com/rakibul561)  
🔗 LinkedIn: [https://www.linkedin.com/in/rakibul-hasan-b94123271/](https://www.linkedin.com/in/rakibul-hasan-b94123271/)

---

## 🙏 Acknowledgments

- Stripe for payment processing
- HuggingFace for free AI models
- Socket.io for real-time features
- Prisma for amazing ORM

---

**Happy Coding! 🎉**