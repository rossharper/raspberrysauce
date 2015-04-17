rm ~/.forever/raspberrysauce.log
forever start -l raspberrysauce.log -o logs/out.log -e logs/err.log -w index.js
