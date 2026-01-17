# 🏡 Homigo — Stay Booking & Property Listing Platform (MVC)

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB%20Atlas-00ED64?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-1B1B1B?style=for-the-badge&logo=ejs&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap%205-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

</div>

---

## 📌 Overview

**Homigo** is a modern full-stack web platform for discovering and hosting stays.  
It provides a complete workflow for **property listings, map-based location viewing, bookings, and reviews**, built with **Node.js, Express, MongoDB Atlas, EJS**, and structured using the **MVC architecture**.

The project focuses on clean backend design, secure authentication, and a smooth booking flow with owner-controlled approvals.

---

## 🚀 Live Demo
🔗 **Homigo (Render):** https://project-homigo-fcsq.onrender.com/listings

---

## 📌 Table of Contents
- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [📂 Project Structure](#-project-structure)
- [⚙️ Installation](#️-installation)
- [🔐 Environment Variables](#-environment-variables)
- [🧭 Deployment (Render)](#-deployment-render)
- [🧩 API Routes](#-api-routes)
- [📸 Screenshots](#-screenshots)
- [✅ Future Enhancements](#-future-enhancements)
- [👨‍💻 Author](#-author)
- [⭐ Support](#-support)

---

## ✨ Features

### 👤 Authentication & Security
- Secure Signup / Login / Logout (Passport.js)
- Session-based authentication
- Protected routes (only logged-in users can perform restricted actions)
- Role-based access (Owner/Author restrictions)

### 🏠 Listings
- Create a new listing with image upload
- Edit / Delete listing (Only listing owner)
- Search listings by **location / country / title**
- Listing details page with host information

### 🗺️ Maps & Location
- Mapbox map integration (interactive location view)
- Mapbox Geocoding (convert place/location → coordinates)

### ⭐ Reviews
- Add reviews with rating/comment
- Delete review (Only review author)
- Reviews displayed on listing detail page

### 📌 Booking System
- Book stays with check-in/check-out dates
- Prevents overlapping bookings
- Booking status workflow:
  - `pending` ✅
  - `approved` ✅
  - `rejected` ✅
  - `cancelled` ✅
- Host dashboard to approve/reject bookings
- User dashboard to manage bookings

### 🔔 Flash Notifications
- Success/Error flash messages for all operations  
(listings, bookings, reviews, authentication)

---

## 🛠 Tech Stack

**Frontend**
- EJS Templates
- Bootstrap 5
- HTML / CSS / JavaScript

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB Atlas
- Mongoose ODM

**Authentication**
- Passport.js
- express-session

**Cloud & Tools**
- Cloudinary (Image uploads)
- Mapbox (Maps + Geocoding)
- connect-mongo (Session store)

---

## 📂 Project Structure

```bash
Project_Homigo/
│
├── controllers/        # Controller logic (listing, booking, review, user)
├── routes/             # Express routes
├── models/             # Mongoose schemas
├── views/              # EJS templates
│   ├── listings/
│   ├── bookings/
│   ├── users/
│   └── layouts/
├── public/             # CSS, JS, assets
├── middleware.js       # Authentication & validation middleware
├── app.js              # App entry point
└── .env                # Environment variables (ignored)
