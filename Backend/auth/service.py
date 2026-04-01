from unittest import result
import bcrypt
from flask import jsonify
from db.connection import get_db
from auth.validation import username_validation, password_validation
from auth.jwt import generate_jwt
import logging
import time
import secrets
import string
from datetime import datetime, timedelta


MAX_LOGIN_ATTEMPTS = 3
LOCKOUT_DURATION = 300  # in seconds

def register_user(username, password):
    if not username_validation(username):
        return jsonify({"message": "Invalid username format"}), 400

    if not password_validation(password):
        return jsonify({"message": "Password must be at least 8 characters long, include a letter, a number, and a special character."}), 400

    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO users (username, password, failed_attempts, lock_until) VALUES (?, ?, ?, ?)",
            (username, hashed, 0, None)
        )
        db.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        logging.warning("Registration failed: %s", str(e))
        return jsonify({"message": "Username already exists"}), 409

def login_user(username, password):
    if not username or not password:
        return jsonify({"message": "Missing credentials"}), 400

    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "SELECT password, failed_attempts, lock_until FROM users WHERE username=?",
        (username,)
    )
    result = cursor.fetchone()
    print("USER:", username)
    print("DB RESULT:", result)

    if result is None:
        logging.warning("Authentication failed")
        return jsonify({"message": "Invalid credentials"}), 401

    stored_hash, attempts, lock_until = result
    current_time = datetime.utcnow()

    # Fix hash type
    if isinstance(stored_hash, str):
        stored_hash = stored_hash.encode('utf-8')

    # Safe lock check
    if lock_until:
        try:
            lock_time = datetime.fromisoformat(lock_until)
            if lock_time > current_time:
                remaining_time = (lock_time - current_time).seconds
                return jsonify({"message": "Account locked", "remainingTime": remaining_time}), 403
        except Exception:
            lock_until = None

    if bcrypt.checkpw(password.encode('utf-8'), stored_hash):
        cursor.execute(
            "UPDATE users SET failed_attempts=0, lock_until=NULL WHERE username=?",
            (username,)
        )
        db.commit()
        token = generate_jwt(username)
        return jsonify({"message": "Login successful", "token": token}), 200

    attempts += 1
    if attempts >= MAX_LOGIN_ATTEMPTS:
        lock_until = (current_time + timedelta(seconds=LOCKOUT_DURATION)).isoformat()
        cursor.execute(
            "UPDATE users SET failed_attempts=?, lock_until=? WHERE username=?",
            (attempts, lock_until, username)
        )
        db.commit()
        return jsonify({"message": "Account locked", "remainingTime": LOCKOUT_DURATION}), 403

    cursor.execute(
        "UPDATE users SET failed_attempts=? WHERE username=?",
        (attempts, username)
    )
    db.commit()
    return jsonify({"message": "Invalid credentials"}), 401





def generate_password(length=8):
    characters = string.ascii_letters + string.digits
    return "".join(secrets.choice(characters) for _ in range(length))