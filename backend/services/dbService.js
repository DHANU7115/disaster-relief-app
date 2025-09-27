// backend/services/dbService.js
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false,
});

// Define Request model
const Request = sequelize.define('Request', {
  localId: { type: DataTypes.STRING, unique: true, allowNull: true },
  requesterName: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  needType: { type: DataTypes.JSON, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  urgency: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  status: { type: DataTypes.ENUM('pending', 'in-progress', 'resolved'), defaultValue: 'pending' },
  location: { type: DataTypes.JSON, allowNull: false },
}, { timestamps: true });

// Initialize DB and sync tables
async function initializeDB() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Creates tables if they don't exist
    console.log('✅ SQLite database connected and synced');
  } catch (err) {
    console.error('Database connection failed:', err);
  }
}

module.exports = { sequelize, Request, initializeDB };
