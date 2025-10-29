const fs = require('fs'); 
const { Cafe, Review } = require('../models');
const { Sequelize } = require('sequelize');

const getAllCafes = async (req, res) => {
  try {
    const cafes = await Cafe.findAll({
      attributes: {
        include: [
          [Sequelize.fn('AVG', Sequelize.col('Reviews.rating')), 'avgRating'],
          [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'reviewCount']
        ]
      },
      include: [{
        model: Review,
        attributes: []
      }],
      group: ['Cafe.id'], 
      order: [['createdAt', 'DESC']]
    });
    res.json(cafes);
  } catch (error) {
    console.error('Gagal mengambil data kafe:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

const createCafe = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(422).json({ message: 'Foto kafe wajib di-upload.' });
    }
    const { name, address, latitude, longitude } = req.body;
    const userId = req.userData.userId;

    const newCafe = await Cafe.create({
      name, address, latitude, longitude, userId,
      photoUrl: req.file.path.replace(/\\/g, "/")
    });

    res.status(201).json(newCafe);
  } catch (error) {
    console.error("CREATE CAFE ERROR:", error);
    res.status(500).json({ message: "Gagal membuat kafe." });
  }
};

const updateCafe = async (req, res) => {
  try {
    const cafeId = parseInt(req.params.id, 10);
    const cafe = await Cafe.findByPk(cafeId);

    if (!cafe) {
      return res.status(404).json({ message: "Kafe tidak ditemukan." });
    }
    if (cafe.userId !== req.userData.userId) {
      return res.status(403).json({ message: "Otorisasi ditolak." });
    }

    const { name, address } = req.body;
    const oldPhotoPath = cafe.photoUrl;

    // Update data teks
    cafe.name = name;
    cafe.address = address;

    // Jika ada file baru yang di-upload, perbarui path fotonya
    if (req.file) {
      cafe.photoUrl = req.file.path.replace(/\\/g, "/");
    }

    await cafe.save();

    // Jika ada file baru, hapus file lama setelah berhasil menyimpan
    if (req.file && oldPhotoPath) {
      fs.unlink(oldPhotoPath, (err) => {
        if (err) {
          console.error("Gagal menghapus foto lama:", err);
        }
      });
    }

    res.status(200).json(cafe);
  } catch (error) {
    console.error("UPDATE CAFE ERROR:", error);
    res.status(500).json({ message: "Gagal mengupdate kafe." });
  }
};

const deleteCafe = async (req, res) => {
  try {
    const cafeId = parseInt(req.params.id, 10);
    const cafe = await Cafe.findByPk(cafeId);

    if (!cafe) {
      return res.status(404).json({ message: "Kafe tidak ditemukan." });
    }
    if (cafe.userId !== req.userData.userId) {
      return res.status(403).json({ message: "Otorisasi ditolak." });
    }

    const photoPath = cafe.photoUrl;
    await cafe.destroy();

    // Hapus file foto yang terkait setelah berhasil menghapus dari database
    if (photoPath) {
      fs.unlink(photoPath, (err) => {
        if (err) {
          console.error("Gagal menghapus foto terkait:", err);
        }
      });
    }
    
    res.status(200).json({ message: "Kafe berhasil dihapus." });
  } catch (error) {
    console.error("DELETE CAFE ERROR:", error);
    res.status(500).json({ message: "Gagal menghapus kafe." });
  }
};

module.exports = {
  getAllCafes,
  createCafe,
  updateCafe,
  deleteCafe
};