var DataTypes = require("sequelize").DataTypes;
var _activation = require("./activation");
var _activation_h8 = require("./activation_h8");
var _activation_flixjini = require("./activation_flixjini");
var _partner = require("./partner");
var _plan = require("./plan");
var _provider = require("./provider");
var _provider_plan_detail = require("./provider_plan_detail");

function initModels(sequelize) {
  var activation = _activation(sequelize, DataTypes);
  var activation_h8 = _activation_h8(sequelize, DataTypes);
  var activation_flixjini = _activation_flixjini(sequelize, DataTypes);
  var partner = _partner(sequelize, DataTypes);
  var plan = _plan(sequelize, DataTypes);
  var provider = _provider(sequelize, DataTypes);
  var provider_plan_detail = _provider_plan_detail(sequelize, DataTypes);

  plan.belongsToMany(provider, { as: 'provider_id_providers', through: provider_plan_detail, foreignKey: "plan_id", otherKey: "provider_id" });
  provider.belongsToMany(plan, { as: 'plan_id_plans', through: provider_plan_detail, foreignKey: "provider_id", otherKey: "plan_id" });
  provider_plan_detail.belongsTo(plan, { as: "plan", foreignKey: "plan_id"});
  plan.hasMany(provider_plan_detail, { as: "provider_plan_details", foreignKey: "plan_id"});
  provider_plan_detail.belongsTo(provider, { as: "provider", foreignKey: "provider_id"});
  provider.hasMany(provider_plan_detail, { as: "provider_plan_details", foreignKey: "provider_id"});

  return {
    activation,
    activation_h8,
    activation_flixjini,
    partner,
    plan,
    provider,
    provider_plan_detail,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
