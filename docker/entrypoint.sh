#!/bin/sh

# make folders and copy .env to app directory
/bin/mkdir -p /config/mongodb
/bin/cp -f /config/.env /voicybot/.env

# start mongodb and voicybot
/usr/bin/mongod --dbpath /config/mongodb --bind_ip 127.0.0.1 --fork --quiet --logpath /config/mongod.log
/usr/local/bin/node /voicybot/app.js