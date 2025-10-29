'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPasswordAdmin = await bcrypt.hash('admin123', 12);
    const hashedPasswordUser = await bcrypt.hash('user123', 12);
    const hashedPasswordZikra = await bcrypt.hash('zikra123',12);

    return queryInterface.bulkInsert('Users', [{
      username: 'admin_ngopiyuk',  
      email: 'admin@ngopiyuk.com',
      password: hashedPasswordAdmin,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'user_ngopiyuk',
      email: 'user@ngopiyuk.com',
      password: hashedPasswordUser,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      username: 'zikra',  
      email: 'zikra@ngopiyuk.com',
      password: hashedPasswordZikra,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};