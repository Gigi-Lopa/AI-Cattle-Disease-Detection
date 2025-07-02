from flask import Flask, request, send_file
from pymongo import MongoClient
from flask_restful import Resource, Api
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId
from pprint import pprint
from .utils.SkinDetection import SkinDetection
import pytz
import os
import json


UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
cat_tz = pytz.timezone('Africa/Harare')

app = Flask(__name__)
api = Api(app=app)

client = MongoClient("mongodb://localhost:27017/")
database = client.cattle_disease_detectio
users = database.users
CORS(app)

class Login(Resource):
    def post(self):
        data = request.get_json();

        if not data.get("username") and data.get("password"):
            return {"message" : "All fields required"},400

        user = users.find_one({"username" : data.get("username")})

        if not user:
            return {
                "message" : "Account does not exist"
            },404

        if not check_password_hash(user.get("password"), data.get("password")):
            return {
                "message" : "Invalid password for account",
                "isPassword" : False 
            }
        
        return{
            "message" : "Account valid",
            "isAccount" : True 
        }

class Register(Resource):
    def post(self):
        data = request.get_json()

        if not data.get("email") or not data.get("password"):
            return {"message" : "All fields required"},400

        if users.find_one({"email" : data.get("email")}):
            return {"message" : "Account already exists"}, 409

        hashed_password = generate_password_hash(data.get("password"))
        user = {
            "username": data.get("username"),
            "email": data.get("email"),
            "password": hashed_password,
            "created_at": datetime.now(cat_tz)
        }

        users.insert_one(user)

        return {"message": "Account created successfully"}, 201

class DetectSkinDisease(Resource):
    def post(self):
        if 'file' not in request.files:
            return {"message": "No file uploaded"}, 400

        options = json.loads(request.form.get("options"))

        file = request.files['file']
        if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            return {"message": "Invalid file type. Only PNG, JPG, and JPEG are allowed."}, 400
      
        FILENAME = f"{int(datetime.now(cat_tz).timestamp())}_{file.filename}"
        file.filename = FILENAME

        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        if options.get("skin_detection") and not options.get("fmd"):
            skin_disease_results = skin_detection.predict(file_path)
        elif options.get("fmd") and not options.get("skin_detection"):
            fmd_results = {"message": "FMD detection is not implemented yet."}
        elif options.get("fmd") and options.get("skin_detection"):
            skin_disease_results = skin_detection.predict(file_path)
            fmd_results = {"message": "FMD detection is not implemented yet."}

        return {
            "message": "File uploaded and processed successfully",
            "status": "success",
            "options"  : options,
            "fmd_disease_results" : fmd_results if fmd_results is not None else [],
            "skin_disease_results": skin_disease_results if skin_disease_results is not None else []
        }, 200

class HostImage(Resource):
    def get(self, filename):
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        if not os.path.exists(file_path):
            return {"message": "File not found"}, 404
        return send_file(file_path)

    
api.add_resource(Login, "/auth")
api.add_resource(Register, "/register")
api.add_resource(DetectSkinDisease, "/detect-skin-disease")
api.add_resource(HostImage, "/uploads/<string:filename>")

if __name__ == "__main__":
    skin_detection = SkinDetection()
    print("Skin Detection model loaded successfully.")
    print("Starting Flask server...")
    app.run(debug=True, host="0.0.0.0", port=5000)
