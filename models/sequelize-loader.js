'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  'postgres://postgres:postgres@localhost/yasune_memo',
  {
    operatorAliases: false
  }
);

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};
