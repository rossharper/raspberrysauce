#forever-service install raspberrysauce -s index.js -e NODE_ENV=production --start -r pi

pm2 start index.js --env production --name raspberrysauce -l ~/homecontrol/logs/raspberrysauce
pm2 save
