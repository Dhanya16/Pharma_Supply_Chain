// migrations/2_deploy_pharma_supply_chain.js
const PharmaSupplyChain = artifacts.require("PharmaSupplyChain");
const AddDrug = artifacts.require("AddDrug");
const AddCategory = artifacts.require("AddCategory");

module.exports = function (deployer) {
  deployer.deploy(PharmaSupplyChain);
  deployer.deploy(AddDrug);
  deployer.deploy(AddCategory);
};
