// migrations/2_deploy_pharma_supply_chain.js
const PharmaSupplyChain = artifacts.require("PharmaSupplyChain");

module.exports = function (deployer) {
  deployer.deploy(PharmaSupplyChain);
};
