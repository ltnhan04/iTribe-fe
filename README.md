# 🚀 iTribe - Modern E-commerce Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="left">
  <img src="https://skillicons.dev/icons?i=nextjs,react,typescript,babel,tailwind,redux,threejs,nodejs,express,mongodb,redis,vite,docker,nginx,git,postman" alt="Tech Stack Icons" />
</p>

## 📋 Overview

iTribe is a modern, full-stack e-commerce platform built with cutting-edge technologies. The platform consists of three main components: Frontend, Admin Dashboard, and Backend API.

## ✨ Key Features

<details>
<summary>🛍️ Customer Features (click to expand)</summary>

* 🔐 Secure authentication

  * JWT & Google OAuth
  * Refresh token mechanism
  * Token revocation & OTP verification
  * Password recovery & email verification
* 🛒 Shopping experience

  * Cart, wishlist (Redux)
  * Advanced product search & filtering
  * Personalized product recommendations
* 📱 UI & Interactivity

  * Responsive design with Tailwind CSS & Radix UI
  * 3D product visualization (Three.js)
  * Smooth animations (GSAP)
* 💬 Support

  * Real-time chat support (Socket.IO)
  * AI chatbot (Gemini)

    * Context-aware conversations
    * Order tracking, product suggestions, FAQs
* 💳 Checkout & notifications

  * Stripe & MoMo integration
  * Email templates & notifications

</details>

<details>
<summary>👨‍💼 Admin Features (click to expand)</summary>

* 📊 Dashboard & analytics

  * Daily, monthly, yearly revenue tracking
  * Sales trends, customer insights
* 📦 Product & inventory management

  * Variants, rich descriptions (CKEditor)
  * Real-time stock updates, low stock alerts
* 👥 User & order management

  * Customer profiles, order history
  * Role-based access control
* 🔄 Realtime order management

  * Status updates, shipping tracking
  * Integrated payment handling
* 🧾 Reporting & exports

  * Advanced analytics, XLSX exports
* 💬 Support tools

  * Customer support system

</details>

## 🛠️ Technology Stack

### Frontend

* Next.js 14 & TypeScript
* Tailwind CSS & Radix UI
* Redux Toolkit with Redux Persist
* Three.js for 3D graphics
* GSAP for animations
* React Query for data fetching
* JWT authentication
* React Hook Form & Zod validation

### Admin Dashboard

* React 18 & TypeScript
* Ant Design
* Recharts for analytics
* CKEditor for rich text
* Redux Toolkit & RTK Query

### Backend

* Node.js with Express
* MongoDB with Mongoose
* JWT Authentication (access/refresh tokens, revocation)
* Nodemailer for email delivery
* Stripe, MoMo integration
* Socket.IO for real-time features
* Redis for caching
* Cloudinary for media storage
* Passport.js for OAuth
* XLSX for data export
* Google AI integration

### DevOps & Infrastructure

* Docker & Docker Compose
* Nginx reverse proxy
* Environment configuration
* Multi-stage builds
* Hot reloading in development

## 🚀 Getting Started

### Prerequisites

* Node.js 20+
* Docker and Docker Compose
* MongoDB & Redis

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ltnhan04/itribe-ecommerce.git
cd itribe
```

2. Set up environment variables:

```bash
# Frontend
cp frontend/.env.example frontend/.env.local

# Admin
cp admin/.env.example admin/.env

# Backend
cp backend/.env.example backend/.env
```

3. Start the application using Docker:

```bash
docker-compose up --build
```

The application will be available at:

* Frontend: [http://localhost:3000](http://localhost:3000)
* Admin Dashboard: [http://localhost:5173](http://localhost:5173)
* Backend API: [http://localhost:8000](http://localhost:8000)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
