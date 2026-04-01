from dotenv import load_dotenv
load_dotenv()

from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman
from auth.routes import auth_blueprint
from db.connection import get_db, close_db   # ✅ FIX

app = Flask(__name__)
CORS(app, supports_credentials=True)

# ✅ register teardown correctly
app.teardown_appcontext(close_db)

# Enforce HTTPS in production
if not app.debug:
    Talisman(app, content_security_policy=None)

# Rate limiter
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["15 per minute"]
)

# ✅ DB initialization
def init_db():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users(
            username TEXT PRIMARY KEY,
            password BLOB,
            failed_attempts INTEGER DEFAULT 0,
            lock_until TEXT DEFAULT NULL
        )
    """)
    db.commit()

# ✅ run once on startup
with app.app_context():
    init_db()

# Register routes
app.register_blueprint(auth_blueprint)

if __name__ == "__main__":
    app.run(debug=True)