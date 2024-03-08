#!/bin/bash
# Checking if script is run as root
if [ "$(id -u)" -ne 0 ]; then
    echo "This script must be run as root. Please use sudo."
    exit 1
fi
echo -e "\nThis script will install all the necessary packages and edit some system settings to setup a Wireless Access Point(AP) or Hotspot."
echo -e "\nThe raspberry pi will reboot after this!"
echo -e "\nUpdating package list..."
apt-get update
apt-get upgrade -y

echo -e "\nSetting up FTP service..."
apt-get install proftpd -y
service proftpd start

echo -e "\nSetting up Apache server and Web interface..."
apt-get install apache2 -y
apt-get install libapache2-mod-php -y
apt-get install php8.2-fpm -y
a2enconf php8.2-fpm
a2enmod proxy_fcgi setenvif
systemctl restart apache2

echo -e "listen.owner = pi\nlisten.group = pi" >> /etc/php/8.2/fpm/php-fpm.conf
mkdir /var/www/aquaai
cp -R /home/pi/Web/* /var/www/aquaai
apt-get install npm -y
cd /var/www/aquaai
npm install
cd /home/pi/Scripts
chown -R -f pi:pi /var/www/aquaai
usermod -a -G pi www-data
chmod +w /etc/sudoers
echo -e "dietpi ALL=(ALL) NOPASSWD:ALL\nwww-data ALL=(ALL) NOPASSWD:ALL\n%dietpi ALL= (ALL:ALL) ALL" >> /etc/sudoers
chmod -w /etc/sudoers
cp /home/pi/Web/aquaai.conf /etc/apache2/sites-available/
a2dissite 000-default.conf
a2ensite aquaai.conf
systemctl restart apache2

echo -e "\nSetting up the AI image recognition..."
apt-get install git pip -y
pip3 install opencv-contrib-python --break-system-packages
apt-get install python3-opencv -y
pip3 install torch --break-system-packages
pip3 install pyserial pandas requests PILLOW --break-system-packages
pip3 install --no-cache "gitpython>=3.1.30" --break-system-packages
# pip3 install ultralytics --break-system-packages
cd /home/pi
git clone https://github.com/ultralytics/yolov5
cd yolov5
pip install -r requirements.txt --break-system-packages
cd /home/pi
echo -e "\nMaking AI image recognition run at boot"
chmod 755 /home/pi/Scripts/launcher.sh
(crontab -l 2>/dev/null; echo "@reboot sh /home/pi/Scripts/launcher.sh >/home/pi/logs/cronlog 2>&1")| crontab -

echo -e "\nMaking all scripts executable in Scripts..."
chmod +x /home/pi/Scripts/*

echo -e "\nInstalling required packages..."
apt install dhcpcd5 dnsmasq hostapd iptables -y
DEBIAN_FRONTEND=noninteractive apt install -y netfilter-persistent iptables-persistent

echo -e "\nSetting up static IP..."
echo -e "auto lo\niface lo inet loopback\n\nauto eth0\niface eth0 inet dhcp\n\nallow-hotplug wlan0\niface wlan0 inet static\n\taddress 192.168.4.1\n\tnetmask 255.255.255.0\n\tnetwork 192.168.4.0\n\tbroadcast 192.168.1.255" >> /etc/network/interfaces

echo -e "\nConfiguring dhcpcd server..."
echo -e "denyinterfaces wlan0" >> /etc/dhcpcd.conf


echo -e "\nEnable Routing and IP Masquerading..."
echo -e "# Enable IPv4 routing\nnet.ipv4.ip_forward=1" > /etc/sysctl.d/routed-ap.conf
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
netfilter-persistent save

echo -e "\nConfiguring static IP..."
mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig
echo -e "interface=wlan0\nlisten-address=192.168.4.1\nbind-interfaces\nserver=1.1.1.1\ndomain-needed\nbogus-priv\ndhcp-range=192.168.4.2,192.168.4.20,255.255.255.0,24h" > /etc/dnsmasq.conf
rfkill unblock wlan
rfkill unblock wifi


echo -e "\nConfiguring the Wifi hotspot..."
echo -e "country_code=IN\ninterface=wlan0\nssid=AquaAI\nhw_mode=g\nchannel=7\nmacaddr_acl=0\nauth_algs=1\nignore_broadcast_ssid=0\nwpa=2\nwpa_passphrase=aquaai1234\nwpa_key_mgmt=WPA-PSK\nwpa_pairwise=TKIP\nrsn_pairwise=CCMP" > /etc/hostapd/hostapd.conf
sed -i 's|#DAEMON_CONF=""|DAEMON_CONF="/etc/hostapd/hostapd.conf"|g' /etc/default/hostapd

systemctl disable dhcpcd.service
systemctl stop dhcpcd.service
systemctl unmask hostapd.service
systemctl enable hostapd.service
systemctl restart hostapd.service

echo -e "\nRebooting the system..."
echo -e "\nWifi credentials:\n SSID(default): AquaAI\nPassword(default):aquaai1234\nPlease change the Wifi password for security."
reboot