// migrations/2_deploy_pharma_supply_chain.js
const PharmaSupplyChain = artifacts.require("PharmaSupplyChain");
const AddDrug = artifacts.require("AddDrug");
const AddCategory = artifacts.require("AddCategory");
const BoxAccessControl = artifacts.require("BoxAccessControl");
const DrugLifeCycle = artifacts.require("DrugLifeCycle");

module.exports = async function (deployer) {
  await deployer.deploy(PharmaSupplyChain);
  const pharmaSupplyChainInstance = await PharmaSupplyChain.deployed();

  await deployer.deploy(AddDrug);
  const addDrugInstance = await AddDrug.deployed(); // Get the deployed AddDrug instance

  await deployer.deploy(AddCategory);
  const addCategoryInstance = await AddCategory.deployed();

  await deployer.deploy(BoxAccessControl);
  const boxAccessControlInstance = await BoxAccessControl.deployed();

  // Deploy DrugLifeCycle and pass the address of the AddDrug contract
  await deployer.deploy(DrugLifeCycle, addDrugInstance.address); // Pass the AddDrug address here
  const drugLifeCycleInstance = await DrugLifeCycle.deployed();
};
