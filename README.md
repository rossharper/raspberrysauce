# Hot Raspberry Sauce

This is a web front-end/API for my IoT home heating system. Currently it is mostly a hack.

Uses:
- Express.js web framework
- ~~Jade~~ Pug view templates
- Stylus css
- ~~Mongoose (Mongo DB)~~
- Passport authentication

# Issues / TODO

Currently hardcoded to read sensor data and programme data from local filesystem at `/var/lib/homecontrol/sensordata/temperatureSensors/TA/` and `/var/lib/homecontrol/programdata`

The API isn't really an API. It is authenticated using the same session-based authentication the web-front end uses. It also isn't properly RESTful at the moment.

TODO:
- User invite / signup
- Password reset
- Token based authentication (for API initially) (move to JSON Web Tokens)
- Stateless (session-less) operation (use tokens for website?)
- Schedule editing

# Usage

    node index.js [-i]

        -i    serve all pages insecure. Otherwise, HTTPS is used by default.

This will launch an insecure HTTP webserver on port 8080 that redirects all traffic to the HTTPS webserver on port 4443.

User management is not implemented, so you'll have to run a utility to insert users into the database:

    node webapp/utils/createUser.js -u {username} -p {password} -e {email}

Or remove them all:

    node webapp/utils/removeUsers.js

# Configuration

The application depends on a number of configuration files being in place. You need to create these. The examples below have default values that you should change.

`servers/config/sslconfig.js`

Server configuration, containing paths to SSL certs.

```
var sslconfig = {};

sslconfig = {};

sslconfig.passphrase = "password-for-your-cert-files";
sslconfig.cacertpath = process.env['HOME'] + "/ca/cert/path";
sslconfig.cacert = "your-ca.crt.pem";
sslconfig.servercertpath = process.env['HOME'] + "/server/cert/path";
sslconfig.servercert = "server-cert.crt.pem";
sslconfig.serverkey = "server-key.key.pem"

module.exports = sslconfig;
```

`webapp/config/config.js`

Configuration file for the web app.

```
module.exports = {
    sessionSecret: "mysessionsecret"
}
```

# Dependencies

MongoDB instance running on localhost with a database named "homecontrol".

# License

Copyright 2016 Ross Harper

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
