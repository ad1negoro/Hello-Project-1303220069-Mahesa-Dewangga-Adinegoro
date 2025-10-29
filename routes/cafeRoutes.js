const express = require('express');
const router = express.Router();
// Impor controller dan middleware
const cafeController = require('../controllers/cafeController');
const { isAuth, isAdmin } = require('../middleware/is-auth'); // Gunakan isAdmin untuk membuat kafe
const reviewRoutes = require('./reviewRoutes');
const fileUpload = require('../middleware/file-upload');

// Rute untuk mendapatkan semua kafe (Akses Publik)
router.get('/', cafeController.getAllCafes);

// Rute untuk membuat kafe baru (Hanya Admin)
// Middleware fileUpload menangani upload gambar, lalu createCafe dijalankan
router.post('/', isAuth, isAdmin, fileUpload.single('photo'), cafeController.createCafe);

// Rute untuk mengupdate kafe (Hanya Admin)
router.put('/:id', isAuth, isAdmin, fileUpload.single('photo'), cafeController.updateCafe);

// Rute untuk menghapus kafe (Hanya Admin)
router.delete('/:id', isAuth, isAdmin, cafeController.deleteCafe);


// NESTED ROUTE UNTUK REVIEW
// Semua request ke /api/cafes/:cafeId/reviews akan ditangani oleh reviewRoutes
router.use('/:cafeId/reviews', reviewRoutes);


module.exports = router;