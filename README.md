# TU-Makerspace-Card-Reader
### Card reader system for Tulane MakerSpace, built with React frontend and Node.JS (Express API with Sequelize to interact with mySQL database)
  

## Getting Started
First, run npm install in the tu-makerspace-card-reader directory, this will install all needed node dependencies. 

Next, you need a MySQL server to hold the Machine, User, and log (coming soon) tables. By default, this database should be called "testDB" with username "root" and password "password". These can be changed in tu-makerspace-card-reader/server/app/config/db.config.js

Next, you can start the development server with **yarn dev** in the tu-makerspace-card-reader directory.

An alternative to this is starting the react dev server with "react-scripts start" in the client directory and starting the backend server with "node server.js" in the server directory.

Routes are detailed in App.js! I reccomend looking at /metalShop1 for a look at the machine view. If you dont see any machines other than the loading machine you dont have any machines in your SQL database! add some!

Feel free to contribute! Fork this repo and submit a pull request! Yes I (Bennett) do push to main sometimes sorry :P


## Scope
### Frontend (in progress):
- Machine Tablet Views: Webpages for different control tablets mounted in the space, where users who are authorised can activate machines after tapping their RFID card. (in progress)
- Register View: Register a new user, requires login from fabTech (in progress)
- Train View: Update a user's trainings to allow access to machines, requires login from fabTech (in progress)
- Audit View: View user logs and machine logs, requires login from admin (in progress)
- Tagout View: Tag out/in and comment on machine status, notifies machine expert, requires login from fabTech (in progress)

### Backend (in progress):
#### Api Calls (complete)
##### These interact with the mySQL database of users. Coming soon is logging of these actions as well as logging machine use and tagouts.
- POST /api/users/ creates a new user, requires login
    REQUIRES: name, splash, email (no @tulane), id (unique int, should be card number), user (username of sponsoring fabTech/admin)
- GET /api/users/ returns all user data, not including password (passwords are hashed but should still not be accessible that feels wrong)
- GET /api/users/fabTech returns all fabTech users, I dont know why i made this call, kinda useless. It's also broken atm.
- GET /api/users/:id returns a user with specified id. id is the card number of their RFID card.
- PUT /api/users/:id updates a user with specified id. id is the card number of their RFID card. (requires user and authPassword of fabTech/Admin). Updated user data should be sent in body with key "updatedUser".
- DELETE /api/users/:id deletes a user with specified id. (requires user and authPassword of fabTech/Admin)

Similar api calls are availible for the machines sql table, go to machine.routes.js to see them.

Basically the backend is in a working state, with new features to be added as neccesary. time to get working on that frontend.

### Self signing instructions for HTTPS key

install mkcert
```
brew install mkcert
mkcert --install
```

create new keys in a .cert directory (should be done in the tu-makerspace-card-reader directory)
```
mkdir -p .cert
mkcert -key-file ./.cert/key.pem -cert-file ./.cert/cert.pem "localhost"
```

### Mysql instructions
Server is configured to connect to a mysql server 'root@localhost' with password given via a .env file. Create a .env file in /tu-makerspace-card-reader/server/ with the following inside of it.
```
 DATABASEROOTUSERPASSWORD=YOUR_PASSWORD 
``` 
You can set the password to whatever you like. 