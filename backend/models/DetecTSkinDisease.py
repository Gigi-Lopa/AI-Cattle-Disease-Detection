"""
return value
[{'label': 'ocular', 'score': 0.850920557975769},
 {'label': 'BlueTongue', 'score': 0.0632033720612526},
 {'label': 'Papillomatosis', 'score': 0.04143591970205307},
 {'label': 'PhotoSensation', 'score': 0.023926731199026108},
 {'label': 'Ringworm', 'score': 0.02051342837512493}]
"""
#import ollama
from transformers import pipeline 

class DetectSkinDiease:
    def __init__(self):
        self.model = pipeline("image-classification", model="./models/Cattle_Skin_Disease", device=0)

    def get_prediction(self, image):
        results = self.model(image)
        
        if not results:
            return {
                "mostLikely": {},
                "otherOccurance": []
            }

        most_likely = max(results, key=lambda x: x.get("score", 0.0))
        other_occurrences = [r for r in results if r != most_likely]

        return {
            "mostLikely": most_likely,
            "otherOccurance": other_occurrences
        }
