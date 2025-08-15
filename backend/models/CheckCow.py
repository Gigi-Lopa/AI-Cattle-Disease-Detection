from ultralytics import YOLO

def check_cow(image_path):
    model = YOLO('./models/Cattle_FMD_Detection/yolov8n.pt')  # or yolov8s.pt, yolov8m.pt etc.
    results = model(image_path)

    results[0].show()

    for box in results[0].boxes:
        class_id = int(box.cls[0])
        class_name = model.names[class_id]
        if class_name == 'cow':
            return True
    
        return False