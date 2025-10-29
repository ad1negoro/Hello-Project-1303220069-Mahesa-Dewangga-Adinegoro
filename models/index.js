"use strict";
const sequelize = require("../config/database");

// Impor model-model utama Anda
const User = require("./User");
const Cafe = require("./Cafe");
const Review = require("./Review");

const db = {
  sequelize,
  Sequelize: sequelize.Sequelize,
  User,
  Cafe,
  Review,
};

// Definisikan semua relasi seperti sebelumnya
User.hasMany(Cafe, { foreignKey: "userId" });
Cafe.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Review, { foreignKey: "userId" });
Review.belongsTo(User, { foreignKey: "userId" });
Cafe.hasMany(Review, { foreignKey: "cafeId" });
Review.belongsTo(Cafe, { foreignKey: "cafeId" });

// --- PERBAIKAN UTAMA DI SINI ---
// Definisikan relasi favorit dan biarkan Sequelize yang membuat
// tabel penghubung 'UserCafeFavorites' secara otomatis.
User.belongsToMany(Cafe, {
  through: "UserCafeFavorites", // Nama tabel penghubung
  as: "FavoriteCafes",
  foreignKey: "userId",
});
Cafe.belongsToMany(User, {
  through: "UserCafeFavorites", // Nama tabel penghubung
  as: "FavoritedByUsers",
  foreignKey: "cafeId",
});
// ---

module.exports = db;
