# AquaAI
AI-based image recognition and soil parameter monitoring to precisely determine growth stage of plants and automate irrigation

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
The Pi will reboot after this and hopefull everything should be setup! </br>
It will host it's own access point with the default ssid: AquaAI and password: aquaai1234

### [4] Access the Web interface by connecting to the AP</br>
type 192.168.4.1 in your browser of choice :)
