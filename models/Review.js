const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Review = sequelize.define(
  "Review",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    photoUrl: { type: DataTypes.STRING, allowNull: true },
  },
  { tableName: "Reviews" }
);
module.exports = Review;
