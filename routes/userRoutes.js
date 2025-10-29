const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// PERBAIKAN UTAMA ADA DI SINI:
// Impor fungsi spesifik menggunakan kurung kurawal {}
const { isAuth, isUser } = require("../middleware/is-auth");
const fileUpload = require("../middleware/file-upload");
console.log(">>> userRoutes loaded <<<");

// Rute untuk mendapatkan profil PENGGUNA YANG SEDANG LOGIN (hanya untuk role 'user')
router.get("/profile", isAuth, userController.getMyProfile);

// Rute untuk mengupdate profil (username, email)
router.put("/profile", isAuth, isUser, userController.updateProfile);

// Rute untuk mengupdate avatar
router.put(
  "/profile/avatar",
  isAuth,
  isUser,
  fileUpload.single("avatar"),
  userController.updateAvatar
);

// Rute untuk mendapatkan profil PENGGUNA LAIN berdasarkan ID
router.get("/:userId", isAuth, userController.getUserById);

module.exports = router;
