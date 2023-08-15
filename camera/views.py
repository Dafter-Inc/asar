from extensions import db
from models.images import Image
from flask_login import login_required
from camera.utils import upload_image_to_cloudinary
from flask import Blueprint, render_template, request, jsonify, flash, redirect, url_for

bp = Blueprint("camera", __name__)


@bp.route("/selfie/", methods=["GET"])
def selfie():
    return render_template("webcam.html")


@bp.route("/selfie/upload_selfie/", methods=["POST"])
def upload_selfie():
    try:
        image_data = request.form.get("image_data")

        upload = upload_image_to_cloudinary(image_data)

        image = Image(image_url=upload["secure_url"])

        try:
            db.session.add(image)

        except Exception as e:
            raise Exception(str(e))

        else:
            db.session.commit()

            return jsonify({"message": "Image uploaded successfully!"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/success/", methods=["GET"])
def success():
    return render_template("success.html")


@login_required
@bp.route("/images/image_actions/", methods=["POST"])
def image_actions():
    data = request.json
    
    selected_action = data.get("action")
    selected_images = data.get("images")

    if selected_action == "delete":
        for id in selected_images:
            image = Image.query.get(int(id))
            
            print(image)

            try:
                db.session.delete(image)
                db.session.commit()

            except Exception as e:
                flash("Something went wrong.", "error")

    elif selected_action == "approve":
        for id in selected_images:
            image = Image.query.get(int(id))
            
            print(image)

            image.approved = True

            try:
                db.session.commit()

            except Exception as e:
                flash("Something went wrong.", "error")

    elif selected_action == "disapprove":
        for id in selected_images:
            image = Image.query.get(int(id))
            
            print(image)

            image.approved = False

            try:
                db.session.commit()

            except Exception as e:
                flash("Something went wrong.", "error")

    return jsonify({"message": "Action performed successfully"})


@bp.route("/images/", methods=["GET"])
@login_required
def images():
    all_images = Image.query.all()

    return render_template("images.html", images=all_images)
