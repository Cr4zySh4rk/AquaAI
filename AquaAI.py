import cv2  # Import OpenCV library for image processing
import torch  # Import PyTorch library for deep learning
import numpy as np  # Import NumPy library for numerical operations
import sys  # Import sys module for system-specific parameters and functions
import serial  # Import serial library for serial communication
import time  # Import time module for time-related functions
import threading  # Import threading module for multi-threading
from ultralytics import YOLO  # Import YOLO object detection model from Ultralytics

# Establish serial communication with Arduino device on /dev/ttyACM0 at baud rate 9600 with 1 second timeout
ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
ser.reset_input_buffer()  # Reset input buffer of serial port

target = "0"  # Initialize target variable to store the detected object's category

# Define a function to capture images from the camera
def cam():
    while True:    
        cam = cv2.VideoCapture(0)  # Initialize the camera capture object

        frame_count = 0  # Initialize frame count
        while True:
            ret, frame = cam.read()  # Read frame from the camera
            frame_count += 1  # Increment frame count

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

        # Load custom YOLO object detection model
        model = torch.hub.load('/home/pi/yolov5', 'custom', path='/home/pi/best.pt', source="local")
        img = "/home/pi/testimage.jpg"  # Path to the saved image
        result = model(img)  # Perform object detection on the image

        try:
            res = result.pandas().xyxy[0]  # Get the detection results
            name_string = res['name'][0].lower()  # Extract the category name of the detected object
            print(name_string)  # Print the detected object category
            # Map object category to target value
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
            print(target)  # Print the target value
            ser.write(target.encode())  # Send the target value to Arduino via serial communication
            ser.reset_input_buffer()
        except Exception as e:
            target = "0"
            print("Error:", e)  # Print error message if object detection fails
            ser.reset_input_buffer()
        file = open("/home/pi/ai.csv", "a")
        file.write("\n" + name_string + ", " + target)
        file.close()
        time.sleep(10)  # Sleep for 10 seconds before capturing the next image

# Define a function to read data from the serial port
def serial_read():
    while True:
        line = ser.readline().decode('utf-8').rstrip()  # Read a line from the serial port
        if line != '':
            # Append the data to a CSV file named "data.csv"
            file = open("/home/pi/data.csv", "a")
            file.write("\n" + line)
            file.close()
            ser.reset_input_buffer()
        time.sleep(5)  # Sleep for 5 seconds before reading the next line

# Create threads for camera and serial communication functions
cam_thread = threading.Thread(target=cam)
serial_thread = threading.Thread(target=serial_read)

# Start the threads
cam_thread.start()
serial_thread.start()

# Wait for the threads to finish execution
cam_thread.join()
serial_thread.join()
