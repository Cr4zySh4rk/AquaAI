# AquaAI
AI-based image recognition and soil parameter monitoring to precisely determine growth stage of plants and automate irrigation

## Installation instructions

### [1] Clone the repo into /home/pi
``` bash
git clone https://github.com/Cr4zySh4rk/AquaAI.git
```

### [2] Move all files from AquaAI into /home/pi
``` bash
mv /home/pi/AquaAI/* /home/pi
```
### [3] Make setup script executable
``` bash
chmod +x /home/pi/Scripts/setup.sh
```

### [3] Run the setup script with sudo
This will take a while to finish, so go grab a cup of coffee :) </br>
The Pi will reboot after this and hopefull everything should be setup! </br>
It will host it's own access point with the default ssid: AquaAI and password: aquaai1234
``` bash
cd Scripts
sudo ./setup.sh
```
