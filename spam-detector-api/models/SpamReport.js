const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const SpamReport = sequelize.define("SpamReport", {
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return SpamReport;
};
