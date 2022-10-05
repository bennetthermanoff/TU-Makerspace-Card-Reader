const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
require('dotenv').config();
const sequelize = new Sequelize("testdb", "root", process.env.DATABASEROOTUSERPASSWORD, {
  host: "localhost",
  dialect: "mysql",
  operatorsAliases: false,
  dialectOptions: {
    socketPath: process.env.socketPath,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
    
  }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./user.model.js")(sequelize, Sequelize);
db.machine= require("./machine.model.js")(sequelize,Sequelize);
module.exports = db;
