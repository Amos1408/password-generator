# 🔐 Password Generator & Checker System

A full-stack web application that allows users to:

* Generate secure passwords
* Register and login securely
* Track failed login attempts
* Lock accounts after multiple failed attempts
* Authenticate users using JWT

---

## 🚀 Tech Stack

### Frontend

* React (Vite)
* JavaScript
* CSS

### Backend

* Flask (Python)
* SQLite
* JWT Authentication
* bcrypt (password hashing)

---

## 📁 Project Structure

```
password-generator/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── auth/
│   ├── db/
│
├── frontend/
│   ├── src/
│   ├── package.json
│
├── README.md
└── .gitignore
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```
git clone https://github.com/Amos1408/password-generator.git
cd password-generator
```

---

## 🖥️ Backend Setup

```
cd backend
pip install -r requirements.txt
python app.py
```

Backend will run on:

```
http://localhost:5000
```

---

## 🌐 Frontend Setup

```
cd frontend
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

```
JWT_SECRET=your_secret_key
MAX_LOGIN_ATTEMPTS=3
LOCKOUT_DURATION=300
```

---

### Frontend (`frontend/.env`)

```
VITE_APP_API_URL=http://localhost:5000
```

---

## 🔐 Features

* ✅ User Registration & Login
* ✅ Password Hashing using bcrypt
* ✅ JWT-based Authentication
* ✅ Account Lock after 3 failed attempts
* ✅ Lockout timer (5 minutes)
* ✅ Secure password generation
* ✅ Protected Dashboard

---

## 📌 Notes

* Do NOT share `.env` files publicly
* Make sure backend is running before frontend
* Restart frontend after changing `.env`

---

## 👨‍💻 Author

Developed by Amosh Kumar

---

## 📜 License

This project is for learning and educational purposes.
