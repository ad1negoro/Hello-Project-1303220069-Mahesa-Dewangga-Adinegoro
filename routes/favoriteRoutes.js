const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/FavoriteController"); // cek huruf besar kecil
const { isAuth } = require("../middleware/is-auth");

// Rute untuk MENAMBAH favorit
// URL: POST /api/favorites
router.post("/", isAuth, favoriteController.addFavorite);
router.get("/", isAuth, favoriteController.getUserFavorites);
// Rute untuk MENGHAPUS favorit
// URL: DELETE /api/favorites/:cafeId
router.delete("/:cafeId", isAuth, favoriteController.removeFavorite);

module.exports = router;
