# This script for local makerspace server runs on startup via crontab 

while ! ping -c 1 -W 1 google.com; do
    echo "Waiting for google ping - network interface might be down..."
    sleep 1
done
cd ~/TU-makerspace-card-reader
git pull origin
cd tu-makerspace-card-reader
npm i
npm run dev