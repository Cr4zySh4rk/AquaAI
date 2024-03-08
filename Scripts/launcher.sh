#!/bin/sh
# launcher.sh
sudo tmux new-session -d -s aquaai python /home/pi/AquaAI.py
sudo tmux set -g status off
