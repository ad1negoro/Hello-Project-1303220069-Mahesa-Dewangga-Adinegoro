// backend/models/Cafe.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Cafe = sequelize.define(
  "Cafe",
  // Argumen ke-1: Nama Model

  // Argumen ke-2: Objek Atribut/Kolom
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: false, // Wajib diisi
    },
  },

  // Argumen ke-3: Objek Opsi
  {
    tableName: "Cafes",
  }
);

module.exports = Cafe;
