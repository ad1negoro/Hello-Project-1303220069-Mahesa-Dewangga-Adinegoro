const { Review, User } = require('../models');

/**
 * @desc    Mendapatkan semua review untuk satu kafe tertentu
 * @route   GET /api/cafes/:cafeId/reviews
 * @access  Public
 */
exports.getReviewsForCafe = async (req, res) => {
  try {
    const { cafeId } = req.params;
    const reviews = await Review.findAll({
      where: { cafeId },
      // Sertakan informasi dari model User, tapi hanya ambil kolom 'username'
      include: [{ model: User, attributes: ['username'] }],
      order: [['createdAt', 'DESC']] // Tampilkan review terbaru di atas
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("GET REVIEWS ERROR:", error);
    res.status(500).json({ message: "Gagal mengambil data review." });
  }
};

/**
 * @desc    Membuat review baru untuk satu kafe
 * @route   POST /api/cafes/:cafeId/reviews
 * @access  Private (Memerlukan login)
 */
exports.createReview = async (req, res) => {
  try {
    const { cafeId } = req.params;
    const { title, description, rating } = req.body;
    const userId = req.userData.userId; // Diambil dari middleware is-auth

    // Data dasar untuk review baru
    const newReviewData = {
      title,
      description,
      rating,
      cafeId: parseInt(cafeId, 10), // Konversi cafeId dari string ke integer
      userId,
    };

    // Cek jika ada file yang di-upload oleh multer
    if (req.file) {
      // Simpan path file ke database. Ganti backslash (\) dengan slash (/) untuk kompatibilitas URL.
      newReviewData.photoUrl = req.file.path.replace(/\\/g, "/");
    }

    // Buat review baru di database
    await Review.create(newReviewData);

    // Setelah berhasil membuat, ambil kembali semua review untuk kafe ini
    // agar frontend bisa langsung me-refresh daftarnya dengan data terbaru.
    const updatedReviews = await Review.findAll({
      where: { cafeId: cafeId },
      include: [{ model: User, attributes: ['username'] }],
      order: [['createdAt', 'DESC']]
    });

    res.status(201).json(updatedReviews);

  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);
    res.status(500).json({ message: "Gagal membuat review." });
  }
};