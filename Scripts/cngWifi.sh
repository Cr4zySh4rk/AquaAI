#!/bin/bash
ssid="$1"
pass="$2"
ch="$3"
if [ ${#ssid} -ge 2 ] && [ ${#ssid} -le 32 ];then
sudo sed -i "s/^ssid=.*/ssid=$ssid/g" /etc/hostapd/hostapd.conf
fi
if [ ${#pass} -ge 8 ] && [ ${#pass} -le 32 ];then
sudo sed -i "s/^wpa_passphrase=.*/wpa_passphrase=$pass/g" /etc/hostapd/hostapd.conf
fi
sudo sed -i "s/^channel=.*/channel=$ch/g" /etc/hostapd/hostapd.conf
