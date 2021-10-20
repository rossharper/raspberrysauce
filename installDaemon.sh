#forever-service install raspberrysauce -s index.js -e NODE_ENV=production --start -r pi

#pm2 start index.js --env production --name raspberrysauce -l ~/homecontrol/logs/raspberrysauce
# setup to serve insecure as SSL is currently terminated at reverse proxy
pm2 start index.js --env production --name raspberrysauce -l ~/homecontrol/logs/raspberrysauce -- -i
pm2 save
