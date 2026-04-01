from flask import Blueprint, request, jsonify
from auth.service import login_user, register_user
from auth.jwt import verify_token

# Create blueprint for authentication
auth_blueprint = Blueprint("auth", __name__)

@auth_blueprint.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    return register_user(username, password)

@auth_blueprint.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    return login_user(username, password)


@auth_blueprint.route("/generate-password", methods=["GET"])
def generate_password_api():
    from auth.service import generate_password  # import inside to avoid circular import

    password = generate_password(8)
    return jsonify({"password": password}), 200



@auth_blueprint.before_request
def protect_routes():
    if request.method == "OPTIONS":
        return '', 200   # ✅ allow preflight

    if request.endpoint and request.endpoint in ['auth.login', 'auth.register', 'auth.generate_password_api']:
        return

    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"message": "Missing or invalid token"}), 401

    token = auth_header.split(' ')[1]
    decoded = verify_token(token)
    if not decoded:
        return jsonify({"message": "Invalid or expired token"}), 401
    
@auth_blueprint.route("/dashboard", methods=["GET"])
def dashboard():
    return jsonify({"message": "Welcome! You are authenticated"}), 200