const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('activation', {
    activation_id: {
      type: DataTypes.STRING(64),
      allowNull: false,
      primaryKey: true
    },
    provider_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    customer_id: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    initiator_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    plan_price: {
      type: DataTypes.FLOAT(8,2),
      allowNull: false
    },
    tariff_period: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    tariff_period_type: {
      type: DataTypes.ENUM('M','D'),
      allowNull: false,
      defaultValue: "M"
    },
    activation_type: {
      type: DataTypes.ENUM('NEW','RENEW'),
      allowNull: false,
      defaultValue: "NEW"
    },
    contract_no: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    mobile_no: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    custom_field_1: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    custom_field_2: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    custom_field_3: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    custom_field_4: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    custom_field_5: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    activation_status: {
      type: DataTypes.ENUM('PENDING','ACTIVE','FAILED'),
      allowNull: false,
      defaultValue: "PENDING"
    },
    error_code: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    updated_by: {
      type: DataTypes.STRING(64),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'activation',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "activation_id" },
        ]
      },
    ]
  });
};
