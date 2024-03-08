import cv2
import time

num=1
cap=cv2.VideoCapture(0)

while True:
    ret, img = cap.read()
    # cv2.imshow("frame", img)

    if cv2.waitKey(1) & 0xFF == ord('c'):
        cv2.imwrite('/home/pi/images/'+str(num)+".jpg", img)
        print("captured "+num)
        num+=1

    if num==4:
        break

cap.release()
cap.destroyAllWindows()