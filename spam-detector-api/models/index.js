const { Sequelize } = require("sequelize");

// Initialize Sequelize with SQLite database
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

// Import models after sequelize is initialized
const User = require("./User")(sequelize); // Pass sequelize instance
const Contact = require("./Contact")(sequelize);
const SpamReport = require("./SpamReport")(sequelize);

// Define model relationships
User.hasMany(Contact, { foreignKey: "userId" });
Contact.belongsTo(User, { foreignKey: "userId" });
User.hasMany(SpamReport, { foreignKey: "reportedBy" });
SpamReport.belongsTo(User, { foreignKey: "reportedBy" });

module.exports = { sequelize, User, Contact, SpamReport };
