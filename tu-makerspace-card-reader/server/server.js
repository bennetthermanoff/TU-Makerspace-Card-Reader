const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./app/models");
const path = require('path');


var fs = require('fs');
var http = require('http');
var https = require('https');

db.sequelize.sync();
var corsOptions = {
  origin: ["http://localhost:3000","https://localhost:3000"]
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route

if(process.env.IS_SERVER){
  var httpServer = http.createServer(app);
  require("./app/routes/user.routes")(app);
  require("./app/routes/machine.routes")(app);
  const HTTPPORT = process.env.PORT || 7001;

  //client build is at ../client/build
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
  httpServer.listen(HTTPPORT, () => {
    console.log(`Server is running on port ${HTTPPORT}.`);
  });
  console.log(`server is running on PID ${process.pid}`);

}
else{
  var privateKey  = fs.readFileSync('../.cert/key.pem', 'utf8');
  var certificate = fs.readFileSync('../.cert/cert.pem', 'utf8');
  
  var credentials = {key: privateKey, cert: certificate};
var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

// set port, listen for requests 
// The backend server still listens for http reqests for dev reasons. 
// shouldnt matter as no sensitive info could be scraped because this is only used for dev purposes.
const HTTPPORT = process.env.PORT || 8080;
// const HTTPSPORT= process.env.PORT || 8443;
require("./app/routes/user.routes")(app);
require("./app/routes/machine.routes")(app);

httpServer.listen(HTTPPORT, () => {
  console.log(`Server is running on port ${HTTPPORT}.`);
});

// httpsServer.listen(HTTPSPORT, () => {
//   console.log(`Server is running on port ${HTTPSPORT}.`);
// });
}