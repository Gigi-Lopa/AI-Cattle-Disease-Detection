
from transformers import pipeline
import os

class SkinDetection:
    def __init__(self):
        self.model = pipeline("image-classification", model="./models/Cattle_Skin_Disease", device=0)

    def predict(self, image_path):
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"The image at {image_path} does not exist.")
        result = self.model(image_path)
        return result   
    