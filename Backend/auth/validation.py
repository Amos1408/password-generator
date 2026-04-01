import re

def username_validation(username):
    return bool(re.match(r"^[a-zA-Z0-9_]{3,20}$", username))

def password_validation(password):
    return bool(re.match(r"^(?=.*[A-Za-z])(?=.*\d).{8,}$", password))