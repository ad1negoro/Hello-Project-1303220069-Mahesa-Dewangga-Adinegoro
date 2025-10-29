const User = require('../models/User');

// Admin bisa melihat semua user
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'createdAt'],
      where: { role: 'user' } // Hanya tampilkan user biasa
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin bisa menghapus user
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const deleted = await User.destroy({
      where: {
        id: req.params.id,
        role: 'user' // Hanya bisa hapus user biasa
      }
    });

    if (!deleted) {
      return res.status(404).json({ error: 'User not found or not authorized' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};