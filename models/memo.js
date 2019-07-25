'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Memo = loader.database.define('memos', {
  memoId: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false
  },
  productName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  shopName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // genre: {
  //   type: Sequelize.STRING,
  //   allowNull: false
  // },
  // isPricedown: {
  //   type: Sequelize.BOOLEAN,
  //   allowNull: false
  // },
  remarks: {
    type: Sequelize.STRING,
    allowNull: true
  },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false
  }
}, {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        fields: ['createdBy']
      }
    ]
  });

module.exports = Memo;
