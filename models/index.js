const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config");

const db = {};

const sequelize = new Sequelize({ ...config, Sync: false });

db.sequelize = sequelize;
db.Sequelize = sequelize;

// db.user = require("./user")(sequelize, Sequelize);
// db.post = require("./post")(sequelize, Sequelize);
// db.like = require("./like")(sequelize, Sequelize);
db.comment = require("./comment")(sequelize, Sequelize);
db.cocomment = require("./cocomment")(sequelize, Sequelize);

module.exports = db;
