const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  // defino el modelo

  sequelize.define("recipe", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
    },
    health: {
      type: DataTypes.INTEGER,
    },
    steps: {
      type: DataTypes.JSON,
    },
    image: {
      type: DataTypes.TEXT,
    },
    dietString: {
      type: DataTypes.STRING,
    },
  });
};
