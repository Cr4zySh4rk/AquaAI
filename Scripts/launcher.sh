#!/bin/sh
# launcher.sh

# Start a new tmux session in detached mode with the name 'aquaai' and run the AquaAI.py script using Python
sudo -u pi tmux new-session -d -s aquaai python /home/pi/AquaAI.py
pm2 start /home/pi/Web/Server/server.js
sudo -u pi tmux new-session -d -s web sudo PORT=80 npm start /home/pi/Web/Client

# Disable status line in the tmux session
sudo -u pi tmux set -g status off
