from extensions import db
from models.users import User
from flask_login import login_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Blueprint, render_template, request, redirect, url_for, flash

bp = Blueprint("users", __name__)


@bp.route("/admin/create_user/", methods=["GET", "POST"])
def create_user():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirm_password = request.form.get("confirm_password")

        if password != confirm_password:
            flash("Passwords don't match", "error")
            return redirect(url_for("users.create_user"))

        if len(password) < 8 and len(confirm_password) < 8:
            flash("Passwords much be at least 8 characters.", "error")
            return redirect(url_for("users.create_user"))

        user = User(
            username=username,
            password=generate_password_hash(password, method="sha256"),
        )

        try:
            db.session.add(user)

        except Exception as e:
            flash("Passwords much be at least 8 characters.", "error")
            return redirect(url_for("users.create_user"))

        else:
            db.session.commit()
            return redirect(url_for("users.login"))

    return render_template("admin/create.html")


@bp.route("/admin/login/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        try:
            this_user = User.query.filter_by(username=username).first()

        except:
            flash("Please check your login credentials.", "error")
            return redirect(url_for("users.login"))

        else:
            if this_user == None:
                flash("This user does not exist.", "error")
                return redirect(url_for("users.login"))

            if not check_password_hash(this_user.password, password):
                flash("Please check your password and try again.", "error")
                return redirect(url_for("users.login"))

            login_user(this_user)

            flash("Logged in successfully.", "message")
            return redirect("/admin/")

    return render_template("admin/login.html")


@bp.route("/admin/logout/")
def logout():
    logout_user()

    return redirect(url_for("home.index"))
