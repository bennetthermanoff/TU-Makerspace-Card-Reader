const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
require('dotenv').config();
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./user.model.js")(sequelize, Sequelize);
db.machine = require("./machine.model.js")(sequelize, Sequelize);
db.machineLog = require("./machineLog.model.js")(sequelize, Sequelize);
db.userEditLog = require("./userEditLog.model.js")(sequelize, Sequelize);
module.exports = db;
