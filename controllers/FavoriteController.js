const { User, Cafe } = require("../models");

// Menambahkan kafe ke daftar favorit user
exports.addFavorite = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const { cafeId } = req.body;

    const user = await User.findByPk(userId);
    const cafe = await Cafe.findByPk(cafeId);

    if (!user || !cafe) {
      return res
        .status(404)
        .json({ message: "User atau Kafe tidak ditemukan." });
    }

    await user.addFavoriteCafe(cafe); // Method dari Sequelize
    res.status(200).json({ message: "Kafe berhasil ditambahkan ke favorit." });
  } catch (error) {
    console.error("Gagal menambahkan favorit:", error);
    res.status(500).json({ message: "Gagal menambahkan favorit." });
  }
};

exports.getUserFavorites = async (req, res) => {
  try {
    const userId = req.userData.userId;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Cafe,
          as: "FavoriteCafes", // harus sesuai alias relasi
          attributes: ["id", "name", "address", "photoUrl"],
          through: { attributes: [] }, // supaya kolom join table tidak ikut tampil
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    res.status(200).json({
      message: "Daftar kafe favorit berhasil diambil.",
      favorites: user.FavoriteCafes,
    });
  } catch (error) {
    console.error("Gagal mengambil daftar favorit:", error);
    res.status(500).json({ message: "Gagal mengambil daftar favorit." });
  }
};

// Menghapus kafe dari daftar favorit user
exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const { cafeId } = req.params; // Ambil dari URL parameter

    const user = await User.findByPk(userId);
    const cafe = await Cafe.findByPk(cafeId);

    if (!user || !cafe) {
      return res
        .status(404)
        .json({ message: "User atau Kafe tidak ditemukan." });
    }

    await user.removeFavoriteCafe(cafe);
    res.status(200).json({ message: "Kafe berhasil dihapus dari favorit." });
  } catch (error) {
    console.error("Gagal menghapus favorit:", error);
    res.status(500).json({ message: "Gagal menghapus favorit." });
  }
};
