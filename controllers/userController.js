console.log(">>> userController loaded <<<");

const { User, Review, Cafe } = require("../models");
const fs = require("fs");

// Mengambil profil lengkap pengguna yang sedang login (dari token)
const getMyProfile = async (req, res) => {
  try {
    const userId = req.userData.userId; // Diambil dari middleware is-auth

    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'avatar', 'role'],
      include: [{
        model: Review,
        attributes: ['id', 'title', 'rating'],
        include: [{ model: Cafe, attributes: ['id', 'name'] }]
      }]
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    // Format data agar mudah digunakan di frontend
    const profileData = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      reviewsCount: user.Reviews ? user.Reviews.length : 0,
      favoritesCount: 0, // Placeholder
      reviews: user.Reviews || [],
    };

    res.json(profileData);
  } catch (error) {
    console.error("Error mengambil profil:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mengupdate profil (username/email) pengguna yang sedang login
const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.userData.userId;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    user.username = username;
    user.email = email;
    await user.save();

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Error mengupdate profil:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mengupdate avatar pengguna yang sedang login
const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Tidak ada file yang di-upload" });
    }
    const userId = req.userData.userId;

    const user = await User.findByPk(userId);
    if (!user) {
      fs.unlink(req.file.path, () => {}); // Hapus file yang terlanjur diupload
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    const oldAvatarPath = user.avatar;
    user.avatar = req.file.path.replace(/\\/g, "/");
    await user.save();

    // Hapus file avatar lama jika bukan avatar default
    if (oldAvatarPath && oldAvatarPath !== "default-avatar.jpg") {
      fs.unlink(oldAvatarPath, (err) => {
        if (err) console.error("Gagal menghapus avatar lama:", err);
      });
    }

    res.json({ avatar: user.avatar });
  } catch (error) {
    console.error("Error mengupdate avatar:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId; // Ambil ID dari parameter URL

    const user = await User.findByPk(userId, {
      // Pilih hanya data publik yang ingin ditampilkan ke orang lain
      attributes: ["id", "username", "avatar"],
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    res.json(user);
  } catch (error) {
    console.error("Error mengambil profil by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getMyProfile,
  updateProfile,
  updateAvatar,
  getUserById,
};
