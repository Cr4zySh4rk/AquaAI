#!/usr/bin/env python3
import sys
import serial
import time
n = len(sys.argv)
if __name__ == '__main__':
    ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
    ser.reset_input_buffer()
    while (True):
        if (n == 2):
            target = str(sys.argv[1])+"\n"
            ser.write(target.encode())
        line = ser.readline().decode('utf-8').rstrip()
        if (line!=''):
            file = open("data.csv", "a")
            file.write("\n"+line);
            file.close()
        time.sleep(1)
