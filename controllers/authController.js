const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Fungsi register disederhanakan karena hashing password sudah otomatis
exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    // Kita tidak perlu hash password di sini lagi.
    // Hook 'beforeCreate' di dalam model User.js akan menanganinya.
    const newUser = await User.create({
      username,
      email,
      password, // Kirim password teks biasa, model yang akan mengenkripsi
      role,
    });
    res.status(201).json({ message: 'User berhasil dibuat!', userId: newUser.id });
  } catch (error) {
    console.error('REGISTRATION ERROR:', error);
    res.status(500).json({ message: 'Gagal mendaftar', error: error.message });
  }
};

// Fungsi login diperbarui untuk menggunakan metode verifikasi dari model
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    // --- PERUBAHAN KUNCI DI SINI ---
    // Gunakan metode 'verifyPassword' yang sudah ada di instance 'user'
    const isPasswordCorrect = await user.verifyPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }
    // ---

    // Jika password benar, buat dan kirim token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, username: user.username },
      process.env.JWT_KEY, // Pastikan menggunakan JWT_KEY dari .env
      { expiresIn: '1h' }
    );
    res.status(200).json({ token });

  } catch (error) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({ message: 'Gagal login', error: error.message });
  }
};