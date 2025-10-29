'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Cafes', [{
        name: 'Kopi Tuku',
        address: 'Jl. Cipete Raya No. 7, Jakarta Selatan',
        latitude: -6.2633,
        longitude: 106.8055,
        photoUrl: 'uploads/images/KopiTuku.jpeg',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Anomali Coffee',
        address: 'Jl. Senopati No. 19, Jakarta Selatan',
        latitude: -6.2349,
        longitude: 106.8087,
        photoUrl: 'uploads/images/AnomaliCoffee.jpeg',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Giyanti Coffee Roastery',
        address: 'Jl. Surabaya No. 20, Menteng, Jakarta Pusat',
        photoUrl: 'uploads/images/GiyantiCoffee.jpeg',
        userId:1,
        latitude: -6.2000,
        longitude: 106.8409,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Cafes', null, {});
  }
};