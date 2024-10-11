const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('provider', {
    provider_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    provider_name: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    aggregator: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    provider_status: {
      type: DataTypes.ENUM('ACTIVE','INACTIVE'),
      allowNull: false,
      defaultValue: "ACTIVE"
    },
    created_by: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    updated_by: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'provider',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "provider_id" },
        ]
      },
    ]
  });
};
