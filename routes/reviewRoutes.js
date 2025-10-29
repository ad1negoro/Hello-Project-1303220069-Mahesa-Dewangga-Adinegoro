// backend/routes/reviewRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewController = require('../controllers/reviewController');

// Impor isAuth dan isUser dari satu file middleware yang sudah kita perbaiki
const { isAuth, isUser } = require('../middleware/is-auth'); 
const fileUpload = require('../middleware/file-upload');

// Terapkan middleware secara berurutan untuk rute POST
// Hanya pengguna yang sudah login (isAuth) dan memiliki peran 'user' (isUser) yang bisa membuat review
router.post('/', isAuth, isUser, fileUpload.single('photo'), reviewController.createReview);

// Rute GET tidak memerlukan login, jadi tidak perlu middleware isAuth
router.get('/', reviewController.getReviewsForCafe);

module.exports = router;