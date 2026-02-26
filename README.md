<div align="center">

# 🏡 Homigo

### A Full-Stack Stay Booking & Property Listing Platform

<br>

## 🌐 [→ VIEW LIVE DEMO ←](https://project-homigo-fcsq.onrender.com/listings)
### `https://project-homigo-fcsq.onrender.com/listings`

<br>

![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB%20Atlas-00ED64?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-1B1B1B?style=for-the-badge&logo=ejs&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap%205-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Mapbox](https://img.shields.io/badge/Mapbox-000000?style=for-the-badge&logo=mapbox&logoColor=white)
![Passport.js](https://img.shields.io/badge/Passport.js-34E27A?style=for-the-badge&logo=passport&logoColor=black)

</div>

---

## 📌 What is Homigo?

**Homigo** is a production-ready, full-stack web application for discovering and hosting stays. It supports the **complete lifecycle of a stay booking platform**: listing properties, managing bookings with approval workflows, writing reviews, and visualizing locations on an interactive map.

> Built with **Node.js + Express**, backed by **MongoDB Atlas**, and deployed live on **Render** — this project showcases MVC architecture, REST API design, cloud integrations, and secure authentication in a real production environment.

---

## ✨ Key Features

### 🔐 Authentication & Security
- Secure **Signup / Login / Logout** powered by **Passport.js**
- **Session-based authentication** with `express-session` + `connect-mongo`
- Protected routes — unauthorized users are redirected with flash messages
- **Role-based access control** — only listing owners can edit/delete their listings; only review authors can delete their reviews

### 🏠 Listings
- Create listings with **image uploads** via **Cloudinary**
- Full **CRUD** — Create, Read, Update, Delete (owner-restricted)
- **Search** listings by title, location, or country
- Detailed listing page with host info, reviews, pricing, and map

### 🗺️ Maps & Geocoding
- **Mapbox GL JS** for interactive, embeddable maps on every listing
- **Mapbox Geocoding API** converts plain-text addresses → coordinates automatically on listing creation

### ⭐ Reviews
- Authenticated users can post reviews with **star ratings + comments**
- Review authors can delete their own reviews
- Reviews aggregated and displayed per listing

### 📅 Booking System *(Full Workflow)*
| Status | Description |
|--------|-------------|
| `pending` | Booking submitted, awaiting host action |
| `approved` | Host confirmed the booking |
| `rejected` | Host declined the booking |
| `cancelled` | Guest cancelled before check-in |

- **Overlap prevention** — system blocks double-bookings for the same dates
- **Host Dashboard** to review, approve, or reject incoming bookings
- **Guest Dashboard** to track booking status and cancel if needed

### 🔔 Flash Notifications
- Contextual success/error messages across all operations (auth, listings, reviews, bookings)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js 20+ |
| **Framework** | Express.js |
| **Database** | MongoDB Atlas + Mongoose ODM |
| **Templating** | EJS + EJS-Mate (layouts) |
| **Auth** | Passport.js (Local Strategy) + express-session |
| **Image Storage** | Cloudinary + Multer |
| **Maps** | Mapbox GL JS + Mapbox Geocoding API |
| **Session Store** | connect-mongo |
| **Frontend** | Bootstrap 5 + Vanilla JS |
| **Deployment** | Render (Web Service) |
| **Validation** | Joi (server-side schema validation) |

---

## 📂 Project Structure

```
Project_Homigo/
│
├── controllers/          # Business logic (listings, bookings, reviews, users)
│   ├── listings.js
│   ├── bookings.js
│   ├── reviews.js
│   └── users.js
│
├── routes/               # Express route definitions
│   ├── listing.js
│   ├── booking.js
│   ├── review.js
│   └── user.js
│
├── models/               # Mongoose schemas & models
│   ├── listing.js
│   ├── booking.js
│   ├── review.js
│   └── user.js
│
├── views/                # EJS templates
│   ├── listings/         # Index, show, new, edit
│   ├── bookings/         # Guest & host dashboards
│   ├── users/            # Login, signup
│   └── layouts/          # Boilerplate layout
│
├── public/               # Static assets (CSS, JS, images)
├── middleware.js          # Auth guards & validation middleware
├── app.js                # App entry point & Express config
├── cloudConfig.js         # Cloudinary configuration
└── .env                  # Environment variables (git-ignored)
```

---

## ⚙️ Installation & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/Project_Homigo.git
cd Project_Homigo

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your credentials (see Environment Variables section below)

# 4. Start the development server
node app.js
# or with nodemon for hot-reload:
npx nodemon app.js

# 5. Visit in browser
http://localhost:8080/listings
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB
ATLASDB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/homigo

# Session
SECRET=your_super_secret_key

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Mapbox
MAP_TOKEN=your_mapbox_public_token
```

---

## 🧩 API Routes

### Listings
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/listings` | Browse all listings |
| `GET` | `/listings/new` | New listing form |
| `POST` | `/listings` | Create a listing |
| `GET` | `/listings/:id` | View listing details |
| `GET` | `/listings/:id/edit` | Edit form (owner only) |
| `PUT` | `/listings/:id` | Update listing (owner only) |
| `DELETE` | `/listings/:id` | Delete listing (owner only) |

### Bookings
| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/listings/:id/bookings` | Create a booking |
| `GET` | `/bookings/my` | Guest's booking dashboard |
| `GET` | `/bookings/host` | Host's booking dashboard |
| `PATCH` | `/bookings/:id/approve` | Approve booking (host only) |
| `PATCH` | `/bookings/:id/reject` | Reject booking (host only) |
| `PATCH` | `/bookings/:id/cancel` | Cancel booking (guest only) |

### Reviews
| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/listings/:id/reviews` | Post a review |
| `DELETE` | `/listings/:id/reviews/:rid` | Delete review (author only) |

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/signup` | Signup form |
| `POST` | `/signup` | Register user |
| `GET` | `/login` | Login form |
| `POST` | `/login` | Authenticate user |
| `GET` | `/logout` | Logout session |

---

## 🚀 Deployment (Render)

This app is deployed as a **Web Service** on [Render](https://render.com):

1. Connect your GitHub repository to Render
2. Set **Build Command**: `npm install`
3. Set **Start Command**: `node app.js`
4. Add all environment variables from `.env` into Render's **Environment** tab
5. Deploy — Render handles the rest!

> **Note:** Free tier services on Render spin down after inactivity. Initial load may take ~30 seconds to wake up.

---

## 👨‍💻 Author

**[Devansh Rawat]**


---

## ⭐ Support

If you found this project helpful or interesting, please consider giving it a **star** — it motivates me to keep building! 🙌

---

<div align="center">
  <sub>Built with ❤️ using Node.js, Express & MongoDB</sub>
</div>
