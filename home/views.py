from datetime import datetime
from models.images import Image
from flask import Blueprint, render_template
from flask_login import current_user

bp = Blueprint("home", __name__)


@bp.route("/", methods=["GET"])
def index():
    today = datetime.now().timestamp()
    start_date = datetime(2023, 9, 1).timestamp()

    approved_images = []
    approved_length = 0

    if start_date <= today:
        if current_user.is_authenticated:
            approved_images = Image.query.all()
            approved_length = len(approved_images)

        else:
            approved_images = Image.query.filter_by(approved=True).all()
            approved_length = len(approved_images)

    print(approved_images)

    return render_template("index.html", images=approved_images, length=approved_length)
