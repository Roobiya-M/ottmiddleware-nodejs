const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('provider_plan_detail', {
    provider_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'provider',
        key: 'provider_id'
      }
    },
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'plan',
        key: 'plan_id'
      }
    },
    provider_plan_code: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    tariff_period: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true
    },
    tariff_period_type: {
      type: DataTypes.ENUM('D','M'),
      allowNull: false,
      defaultValue: "M"
    },
    plan_price: {
      type: DataTypes.FLOAT(8,2),
      allowNull: false
    },
    created_by: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    updated_by: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'provider_plan_detail',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "provider_id" },
          { name: "plan_id" },
          { name: "tariff_period" },
        ]
      },
      {
        name: "fk_provider_plan_detail_2_idx",
        using: "BTREE",
        fields: [
          { name: "plan_id" },
        ]
      },
    ]
  });
};
