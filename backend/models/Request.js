const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/dbService'); // Make sure server.js exports sequelize instance

const Request = sequelize.define('Request', {
  localId: { 
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: true 
  },
  requesterName: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  phone: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  needType: { 
    type: DataTypes.JSON,   // Store array as JSON
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  urgency: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    validate: { min: 1, max: 5 } 
  },
  status: { 
    type: DataTypes.ENUM('pending', 'in-progress', 'resolved'), 
    defaultValue: 'pending' 
  },
  location: { 
    type: DataTypes.JSON,   // { lat: number, lng: number }
    allowNull: false 
  }
}, {
  timestamps: true
});

module.exports = Request;
