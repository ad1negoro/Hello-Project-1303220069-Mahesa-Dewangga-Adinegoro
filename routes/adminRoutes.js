const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Impor fungsi yang dibutuhkan dari satu file is-auth.js
const { isAuth, isAdmin } = require('../middleware/is-auth');

// Terapkan middleware untuk SEMUA rute di file ini
// Pertama, cek apakah sudah login (isAuth), lalu cek apakah dia admin (isAdmin)
router.use(isAuth, isAdmin);

// Get all users (hanya admin)
router.get('/users', adminController.getAllUsers);

// Delete user (hanya admin)
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;