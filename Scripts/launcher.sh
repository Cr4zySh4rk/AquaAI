#!/bin/sh
# launcher.sh
sudo -u pi tmux new-session -d -s aquaai python /home/pi/AquaAI.py
sudo -u pi tmux set -g status off