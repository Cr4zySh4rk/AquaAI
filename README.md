# AquaAI
AI-based image recognition and soil parameter monitoring to precisely determine growth stage of plants and automate irrigation.
![Screenshot 2024-03-14 at 7 28 41 PM](https://github.com/Cr4zySh4rk/AquaAI/assets/75577562/329e5eeb-69cc-493d-ae19-a41f9e922fb8)
![Screenshot 2024-03-14 at 7 31 24 PM](https://github.com/Cr4zySh4rk/AquaAI/assets/75577562/07963ec9-94d7-46b9-8ba5-117f0cee0342)
![Screenshot 2024-03-14 at 7 31 14 PM](https://github.com/Cr4zySh4rk/AquaAI/assets/75577562/9bb8e2da-8875-45cb-b716-fd943abf14be)
![Screenshot 2024-03-14 at 7 30 38 PM](https://github.com/Cr4zySh4rk/AquaAI/assets/75577562/0ca74773-7416-457b-b8ae-19aa274c6c4a)

## Installation instructions

### Prerequisites:
[1] Raspberry Pi flashed with latest Raspberry Pi OS Lite (64bit) </br>
[2] git must be installed, if not run "sudo apt-get install git -y"</br>

### [1] Clone the repo into /home/pi
``` bash
git clone https://github.com/Cr4zySh4rk/AquaAI.git
```

### [2] Move all files from AquaAI into /home/pi
``` bash
mv /home/pi/AquaAI/* /home/pi
rm -rf AquaAI
```
### [3] Make setup script executable
``` bash
chmod +x /home/pi/Scripts/setup.sh
```

### [3] Run the setup script with sudo
``` bash
cd Scripts
sudo ./setup.sh
```
This will take a while to finish, so go grab a cup of coffee :) </br>
Also consider disabling sleep on the machine you are using to ssh </br>
so that the execution of the script is not interrupted! </br>
The Pi will reboot after this and hopefull everything should be setup! </br>
It will host it's own access point with the default ssid: AquaAI and password: aquaai1234

### [4] Access the Web interface by connecting to the AP</br>
Type 192.168.4.1 or <hostname>.local in your browser of choice :)
