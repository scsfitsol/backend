#!/bin/bash

sudo chmod -R 777 /root/backend

cd /root/backend

npm i 

pm2 restart 0
