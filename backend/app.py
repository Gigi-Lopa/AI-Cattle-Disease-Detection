from flask import Flask, request, send_file
from pymongo import MongoClient, DESCENDING
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
from models.DetecTSkinDisease import DetectSkinDiease
from models.FMD import DetectFMD
from models.CheckCow import check_cow

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
cat_tz = pytz.timezone('Africa/Harare')

app = Flask(__name__)
api = Api(app=app)

client = MongoClient("mongodb://localhost:27017/")
database = client.cattle_disease_detection
users = database.users
predictions = database.predictions
CORS(app)

skin_disease = DetectSkinDiease()
fmd = DetectFMD()
class Auth(Resource):
    def post(self):
        data = request.get_json()
        if not data.get("email") and data.get("password"):
            return {"message" : "All fields required"},400

        user = users.find_one({"email" : data.get("email")})

        if not user:
            return {
                "isAccount" : False,
                "message" : "Account does not exist"
            },404
        if not check_password_hash(user.get("password"), data.get("password")):
            return {
                "message" : "Invalid password for account",
                "isPassword" : False,
                "isAccount" : False,
            }
        
        return{
            "message" : "Account valid",
            "isAccount" : True ,
            "isPassword" : True,
            "id" : str(user.get("_id", "")),
            "fullname": user.get("fullname")
        }

    def put(self):
        data = request.get_json()

        fullname = data.get("fullname")
        email = data.get("email")
        password = data.get("password")
        occupation = data.get("occupation")

        if not fullname and not email and not password:
            return {
                "Message" : "All fields required"
            }, 400
    
        hashed_password = generate_password_hash(password=password)

        user = users.insert_one({
            "fullname": fullname,
            "email" : email,
            "occupation" : occupation,
            "password" : hashed_password
        })

        if user.inserted_id:
            return {
                "status" : "OK",
                "message" : "User registered",
                "id" : str(user.inserted_id),
                "fullname" : fullname
            }, 200

        return {
            "message" :"Failed to register user"
        }
class Detection(Resource):
    def save_to_history(self, skin_disease_results, fmd_results, owner_id, filename):
        history_record = {
            "owner_id": owner_id,
            "filename": filename,
            "predictions": [],
            "created_at": datetime.now(cat_tz)
        }

        if skin_disease_results:
            history_record["predictions"].append({
                "type": "Skin Disease",
                "results": skin_disease_results.get("mostLikely")
            })

        if fmd_results:
            history_record["predictions"].append({
                "type": "Foot and Mouth Disease",
                "results": fmd_results
            })

        predictions.insert_one(history_record)

    def put(self):
        options_json = request.form.get("options")
        file = request.files.get("image")
        owner_id = request.form.get("id")

        if not options_json or not file or not owner_id:
            return {"message": "All fields required."}, 400

        try:
            options = json.loads(options_json)
        except json.JSONDecodeError:
            return {"message": "Invalid JSON in options field."}, 400

        timestamp = datetime.now(cat_tz).strftime('%Y%m%d_%H%M%S')
        filename = f"{timestamp}.jpg"
        output_dir = './uploads/'
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, filename)
        file.save(output_path)

        skin_disease_results = skin_disease.get_prediction(output_path) if options.get("skin_disease") else {}
        fmd_results = fmd.get_prediction(output_path) if options.get("fmd") else {}

        self.save_to_history(skin_disease_results, fmd_results, owner_id, filename)

        return {
            "status": True,
            "message": "Prediction successful",
            "predictions": {
                "skin_disease_results": skin_disease_results,
                "fmd_disease_results": fmd_results
            },
        }, 200

    def get(self):
        pass
class Images(Resource):
    def get(self, image_name):
        mode = request.args.get("mode", "")

        image_path = os.path.join("uploads", image_name)
        if mode == "fmd":
            image_path = os.path.join("uploads", "fmd_results", image_name)

        return send_file(image_path, mimetype="image/jpeg")
    
class History(Resource):
    def get(self, user_id):
        try:
            docs = predictions.find(
                {"owner_id": user_id}
            ).sort("created_at", DESCENDING)

            result = []

            for doc in docs:
                if "predictions" in doc and len(doc["predictions"]) > 0:
                    top_pred = max(
                        doc["predictions"],
                        key=lambda p: p["results"].get("score") or p["results"].get("confidence") or 0
                    )

                    result.append({
                        "filename": doc.get("filename"),
                        "prediction_type": top_pred.get("type"),
                        "label": top_pred.get("results", {}).get("label") or top_pred.get("results", {}).get("message"),
                        "score_or_confidence": top_pred.get("results", {}).get("score") or top_pred.get("results", {}).get("confidence")
                    })

            return {"history": result, "success": True}, 200

        except Exception as e:
            return {"error": str(e)}, 500


api.add_resource(Auth, "/auth")
api.add_resource(Detection, "/detect")
api.add_resource(Images, "/image/<string:image_name>")
api.add_resource(History, "/history/<string:user_id>")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)