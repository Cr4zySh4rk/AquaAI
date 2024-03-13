#!/bin/bash

# Read command line arguments for SSID, password, and channel
ssid="$1"
pass="$2"
ch="$3"

# Check if SSID length is between 2 and 32 characters
if [ ${#ssid} -ge 2 ] && [ ${#ssid} -le 32 ]; then
    # Replace SSID in hostapd configuration file
    sudo sed -i "s/^ssid=.*/ssid=$ssid/g" /etc/hostapd/hostapd.conf
fi

# Check if password length is between 8 and 32 characters
if [ ${#pass} -ge 8 ] && [ ${#pass} -le 32 ]; then
    # Replace password in hostapd configuration file
    sudo sed -i "s/^wpa_passphrase=.*/wpa_passphrase=$pass/g" /etc/hostapd/hostapd.conf
fi

# Replace channel in hostapd configuration file
sudo sed -i "s/^channel=.*/channel=$ch/g" /etc/hostapd/hostapd.conf
