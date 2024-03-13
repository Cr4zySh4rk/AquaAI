import cv2
import torch
import numpy as np
import sys
import serial
import time
import threading
from ultralytics import YOLO
ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
ser.reset_input_buffer()
target=""
def cam():
    while True:    
        cam = cv2.VideoCapture(0)

        frame_count = 0
        while True:
            ret, frame = cam.read()
            frame_count += 1

            # Display the live video feed
            # cv2.imshow('Live Video', frame)

            # Check if we've reached the 60th frame
            if frame_count == 60:
                # Save the 60th frame as an image
                cv2.imwrite('/home/pi/testimage.jpg', frame)
                break

            k = cv2.waitKey(1)
            if k != -1:
                break

    # Release the camera and close all OpenCV windows
        cam.release()
        cv2.destroyAllWindows()

        model = torch.hub.load('ultralytics/yolov5', 'custom', path='./best.pt')
        img = "/home/pi/testimage.jpg"
        result = model(img)

        try:
            res = result.pandas().xyxy[0]
            name_string = res['name'][0].lower()  # Extract the string value from the pandas Series
            print(name_string)
            if name_string == "bud":
                target = "40"
            elif name_string == "flower":
                target = "50"
            elif name_string == "early-fruit":
                target = "60"
            elif name_string == "mid-growth":
                target = "70"
            elif name_string == "mature":
                target = "60"
            print(target)
            ser.write(target.encode())
        except Exception as e:
            print("Error:", e)
        time.sleep(10)

def serial_read():
    while (True):
        line = ser.readline().decode('utf-8').rstrip()
        if (line!=''):
            file = open("data.csv", "a")
            file.write("\n"+line);
            file.close()
        time.sleep(5)

cam_thread = threading.Thread(target=cam)
serial_thread = threading.Thread(target=serial_read)

cam_thread.start()
serial_thread.start()

cam_thread.join()
serial_thread.join()
