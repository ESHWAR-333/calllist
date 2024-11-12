const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Contact = sequelize.define(
    "Contact",
    {
      id: {
        // Adding ID field for primary key
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        // Foreign key referencing Users
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      isSpam: {
        // Adding isSpam field
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true, // Automatically add createdAt and updatedAt fields
    }
  );

  return Contact;
};
