from ultralytics import YOLO
import os
from datetime import datetime
import pytz

class DetectFMD:
    def __init__(self): 
        self.cat_tz = pytz.timezone('Africa/Harare')
        self.model = YOLO('./models/Cattle_FMD_Detection/FMD_DETECTION.pt')

    def get_prediction(self, image_path):
        if not image_path or not os.path.exists(image_path):
            return {"isValid": False, "message": "Image not found"}

        results = self.model(image_path)

        if not results[0].boxes or len(results[0].boxes) == 0:
            return {
                "isValid": True,
                "confidence": 0.0,
                "message": "No FMD detected. Cattle likely healthy."
            }
       
        timestamp = datetime.now(self.cat_tz).strftime('%Y%m%d_%H%M%S')
        filename = f"{timestamp}.jpg"       
        output_dir = './uploads/fmd_results'

        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, filename)
        results[0].save(output_path)

        confidence = results[0].boxes[0].conf.item()

        if confidence >= 0.80:
            message = "High confidence: FMD detected!"
            is_healthy = False
        elif confidence >= 0.50:
            message = "Moderate signs of FMD detected."
            is_healthy = False
        elif confidence >= 0.30:
            message = "Low confidence detection. Monitor animal."
            is_healthy = True
        else:
            message = "Likely healthy — no clear FMD signs."
            is_healthy = True

        return {
            "isValid": True,
            "confidence": round(confidence, 2),
            "message": message,
            "filename" : filename
        }

