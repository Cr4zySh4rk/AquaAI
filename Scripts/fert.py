#!/usr/bin/env python3
import sys
import serial
import time
if __name__ == '__main__':
    ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
    ser.reset_input_buffer()
    target = "fert"+"\n"
    ser.write(target.encode())
