from flask import Flask, request, send_file
from pymongo import MongoClient
from flask_restful import Resource, Api
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId
from pprint import pprint
import pytz
import os
import json
import ollama

from transformers import pipeline

#model = pipeline("image-classification", model="./models/Cattle_Skin_Disease", device=0)
""" def check_model():
    image_url = "./models/Cattle_Skin_Disease/images/zoom668x437z100000cw668.png"
    result = model(image_url)
    pprint(result)
"""

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

        if not data.get("email") and data.get("password"):
            return {"message" : "All fields required"},400

        user = users.find_one({"email" : data.get("email")})

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





api.add_resource(Login, "/auth"),
 