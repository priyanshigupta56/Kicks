# Kicks 
A MERN app to manage products, orders and users. This README explains how to set up backend and frontend locally, environment variables, default dev admin credentials, demo links, API summary, seeding data, and deployment notes.

---

## 1. Project overview
   Kicks is a MERN stack application (React + Node/Express + MongoDB) with JWT auth, product management, ordering and a contact endpoint. The frontend is built with React (Vite) and Tailwind CSS. The backend exposes REST endpoints and uses MongoDB.

   ---
## 2. Setup & run
   git clone https://github.com/priyanshigupta56/Kicks.git
   cd kicks

---

## 3. Backend — setup & run
   cd backend
   npm install
- Create .env
- Start dev server:
   npm run dev  / 
   npm start

  ---
  
## 4. Frontend — setup & run
  cd frontend
  npm install
- Create .env
  npm start

---

## 5. Environment Variables description
### (i) /backend/.env
PORT = 5000
MONGO_URI=mongodb+srv://sleepypriii21_db_user:3eZd092Q0ZdDtilA@kicks.8qrkdhb.mongodb.net/?appName=kicks
JWT_SECRET = my_shoes_secret_key
ADMIN email: "admin@kicks.com",
ADMIN password: "kicks123",
ADMIN name: "Kicks Admin",
RECAPTCHA_SECRET = your-secret-key
VITE_API_URL=https://kicks-tkmv.onrender.com

### (ii) /frontend/.env
REACT_APP_API_URL=http://localhost:5000/api
(Works with local backend)

---

## 6. Default admin login credentials
ADMIN email: "admin@kicks.com",
ADMIN password: "kicks123",
ADMIN name: "Kicks Admin",

---

## 7. Tech Stack Used
### - Frontend - React.js ,Tailwind CSS
 - Axios (API requests)
 - Context API / State Management (if used)
 - Vercel Deployment
  
### - Backend - Node.js ,Express.js
 - MongoDB (Mongoose)
 - JWT (JSON Web Token) Authentication
 - Axios (server-to-server calls if needed)
 - Render Deployment

### - Database - MongoDB Atlas (cloud database)
REST API, Environment Variables (.env), CORS Enabled, Postman for API Testing

---

## 8. Hosted demo link-
https://kicks-ivory.vercel.app/  (WebApp)(Vercel)
https://kicks-tkmv.onrender.com/ (Backend - Render)

   
   
