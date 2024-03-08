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

echo -e "\nInstalling required packages..."
apt install dhcpcd5 dnsmasq hostapd iptables -y
sudo DEBIAN_FRONTEND=noninteractive apt install -y netfilter-persistent iptables-persistent

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