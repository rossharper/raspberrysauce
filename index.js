var app = require('./webapp/app');

var securePort = process.argv[2] || 4443,
    insecurePort = process.argv[3] || 8080;

var serveInsecure = false;
function parseArgs() {
	if(process.argv.indexOf("-i") != -1){
    	serveInsecure = true;
	}
}

function start() {
    if(serveInsecure) {
    	require('./servers/insecureServer').start(app.create(), insecurePort);
    }
    else {
    	require('./servers/SecureServer').start(app.create(), securePort);
    	require('./servers/RedirectingInsecureServer').start(insecurePort);	
    }
}

parseArgs();
start();