rm ~/.forever/forever.log
forever start -l forever.log -o logs/out.log -e logs/err.log -w index.js
