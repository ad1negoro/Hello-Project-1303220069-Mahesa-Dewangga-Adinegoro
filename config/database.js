const { Sequelize } = require('sequelize');
require('dotenv').config(); // Pastikan dotenv dipanggil di sini juga

const sequelize = new Sequelize(
  'ngopiyuk_db', 
  'postgres', 
  process.env.DB_PASSWORD, // <-- PASTIKAN MENGGUNAKAN INI
  {
    host: 'localhost',
    dialect: 'postgres'
  }
);

module.exports = sequelize;