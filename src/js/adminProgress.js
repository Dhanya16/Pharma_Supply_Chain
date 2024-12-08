// const one = document.querySelector(".one");
// const two = document.querySelector(".two");
// const three = document.querySelector(".three");
// const four = document.querySelector(".four");
// const five = document.querySelector(".five");
// const six = document.querySelector(".six");
// const seven = document.querySelector(".seven");
// const eight = document.querySelector(".eight");

const contractABI = [
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "distributions",
    "outputs": [
      {
        "internalType": "string",
        "name": "distributionBatch",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "distributorName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "dispatchDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "dispatchTime",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "quantityDispatched",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "labTests",
    "outputs": [
      {
        "internalType": "string",
        "name": "labTestId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "labTestDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "labTestTime",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "labName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "testerName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "result",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "lockedBoxes",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "logisticsProviders",
    "outputs": [
      {
        "internalType": "string",
        "name": "logisticsProvider",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "pickupDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "pickupTime",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "deliveryDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "deliveryTime",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "packagings",
    "outputs": [
      {
        "internalType": "string",
        "name": "packageBatch",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "packageDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "packageTime",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "quantityPackaged",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "packagingFacility",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "pharmacies",
    "outputs": [
      {
        "internalType": "string",
        "name": "pharmacyName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "drugName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "categoryName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "drugDescription",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "manufactureDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "expiryDate",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "qualityControls",
    "outputs": [
      {
        "internalType": "string",
        "name": "testId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "testDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "testTime",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "testerName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "result",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "warehouses",
    "outputs": [
      {
        "internalType": "string",
        "name": "warehouseNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "arrivalDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "arrivalTime",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "warehouseName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "storageLocation",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "storageConditions",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blockNumber",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "testId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "testDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "testTime",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "testerName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "result",
        "type": "string"
      }
    ],
    "name": "addQualityControl",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blockNumber",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "packageBatch",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "packageDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "packageTime",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "quantityPackaged",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "packagingFacility",
        "type": "string"
      }
    ],
    "name": "addPackaging",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blockNumber",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "labTestId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "labTestDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "labTestTime",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "labName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "testerName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "result",
        "type": "string"
      }
    ],
    "name": "addLabTesting",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blockNumber",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "distributionBatch",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "distributorName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "dispatchDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "dispatchTime",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "quantityDispatched",
        "type": "uint256"
      }
    ],
    "name": "addDistribution",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blockNumber",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "logisticsProvider",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "pickupDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "pickupTime",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "deliveryDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "deliveryTime",
        "type": "string"
      }
    ],
    "name": "addLogistics",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blockNumber",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "warehouseNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "arrivalDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "arrivalTime",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "warehouseName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "storageLocation",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "storageConditions",
        "type": "string"
      }
    ],
    "name": "addWarehouse",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "blockNumber",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "pharmacyName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "drugName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "categoryName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "drugDescription",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "manufactureDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "expiryDate",
        "type": "string"
      }
    ],
    "name": "addPharmacy",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const contractAddress = '0xff6960336a90547B7cb60044cE6eC8A33D98f977';  // Replace with your actual contract address

// Initialize the contract using web3
const web3 = new Web3(window.ethereum);  // Ensure MetaMask or another web3 provider is available
const drugLifecycleContract = new web3.eth.Contract(contractABI, contractAddress);

// Function to get query parameters as an object
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const queryParams = {};
    for (const [key, value] of params.entries()) {
        queryParams[key] = value;
    }
    return queryParams;
}

// Function to populate the drug details
function populateDrugDetails(drugDetails) {
    // Example of how to populate drug details in the specific card (you need to adjust this to fit your actual HTML)
    document.querySelector('#card .card_details span').innerText = drugDetails.batchNumber || 'N/A';
    document.querySelector('#card .card_details p:nth-child(2) span').innerText = drugDetails.name || 'N/A';
    document.querySelector('#card .card_details p:nth-child(3) span').innerText = drugDetails.category || 'N/A';
    document.querySelector('#card .card_details p:nth-child(4) span').innerText = drugDetails.manufacturer || 'N/A';
    document.querySelector('#card .card_details p:nth-child(5) span').innerText = drugDetails.manufacturingDate || 'N/A';
    document.querySelector('#card .card_details p:nth-child(6) span').innerText = drugDetails.expiryDate || 'N/A';
    document.querySelector('#card .card_details p:nth-child(7) span').innerText = drugDetails.quantity || 'N/A';
    document.querySelector('#card .card_details p:nth-child(8) span').innerText = drugDetails.storageConditions || 'N/A';
    document.querySelector('.progress.one').classList.add('active');
}

// Get the query parameters
const drugDetails = getQueryParams();

// Populate the drug details on the page
populateDrugDetails(drugDetails);
function serializeBigInt(value) {
    if (typeof value === 'bigint') {
        return value.toString(); // Convert BigInt to string
    } else if (Array.isArray(value)) {
        return value.map(serializeBigInt); // Map through arrays
    } else if (typeof value === 'object' && value !== null) {
        const result = {};
        for (const key in value) {
            result[key] = serializeBigInt(value[key]); // Recursively handle objects
        }
        return result;
    }
    return value; // Return as is for non-BigInt values
}

async function retrieveDrugLifecycleDetails(blockNumber) {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const userAddress = accounts[0];

    try {
        // 2. Initial Quality Control
        
        const qcData = await drugLifecycleContract.methods.qualityControls(blockNumber).call({from: userAddress});

        if (qcData && qcData.testId) {
            document.getElementById('qcTestId').innerText = qcData.testId;
            document.getElementById('qcTestDate').innerText = qcData.testDate;
            document.getElementById('qcTestTime').innerText = qcData.testTime;
            document.getElementById('qcTesterName').innerText = qcData.testerName;
            document.getElementById('qcResult').innerText = qcData.result;
            document.querySelector('.progress.two').classList.add('active');  // Activate only if valid data
            if (qcData.result.toLowerCase() === 'failed') {
              document.getElementById('failureMessage').style.display = 'block';
              // Disable further progress steps
              for (let i = 3; i <= 8; i++) {
                const progressElement = document.querySelector(`.progress.${getClassName(i)}`);
                if (progressElement) { // Check if the element exists
                  progressElement.classList.remove('active'); // Remove active class
                  progressElement.classList.add('disabled'); // Add disabled class to change color
                }
              }
              return; // Exit the function to prevent further checks
            }
        }

        // 3. Packaged Drugs
        const packagedDrugData = await drugLifecycleContract.methods.packagings(blockNumber).call({ from: userAddress });
        if (packagedDrugData && packagedDrugData.packageBatch) {
            document.getElementById('PackageNumber').innerText = packagedDrugData.packageBatch;
            document.getElementById('PackageDate').innerText = packagedDrugData.packageDate;
            document.getElementById('PackageTime').innerText = packagedDrugData.packageTime;
            document.getElementById('QuantityPackaged').innerText = packagedDrugData.quantityPackaged;
            document.getElementById('PackagingFacility').innerText = packagedDrugData.packagingFacility;
            document.querySelector('.progress.three').classList.add('active');  // Activate only if valid data
        }

        // 4. Lab Testing
        const labTestingData = await drugLifecycleContract.methods.labTests(blockNumber).call({ from: userAddress });
        if (labTestingData && labTestingData.labTestId) {
            document.getElementById('labTestId').innerText = labTestingData.labTestId;
            document.getElementById('labTestDate').innerText = labTestingData.labTestDate;
            document.getElementById('labTestTime').innerText = labTestingData.labTestTime;
            document.getElementById('labName').innerText = labTestingData.labName;
            document.getElementById('labTesterName').innerText = labTestingData.testerName;
            document.getElementById('labResults').innerText = labTestingData.result;
            document.querySelector('.progress.four').classList.add('active');  // Activate only if valid data
            if (labTestingData.result.toLowerCase() === 'failed') {
              document.getElementById('failureMessage').style.display = 'block';
              // Disable further progress steps
              for (let i = 5; i <= 8; i++) {
                const progressElement = document.querySelector(`.progress.${getClassName(i)}`);
                if (progressElement) { // Check if the element exists
                  progressElement.classList.remove('active'); // Remove active class
                  progressElement.classList.add('disabled'); // Add disabled class to change color
                }
              }
              return; // Exit the function to prevent further checks
            }
        }

        // 5. Sent to Distributors
        const distributionData = await drugLifecycleContract.methods.distributions(blockNumber).call({ from: userAddress });
        if (distributionData && distributionData.distributionBatch) {
            document.getElementById('distributionBatchNumber').innerText = distributionData.distributionBatch;
            document.getElementById('distributorName').innerText = distributionData.distributorName;
            document.getElementById('dispatchDate').innerText = distributionData.dispatchDate;
            document.getElementById('dispatchTime').innerText = distributionData.dispatchTime;
            document.getElementById('quantityDispatched').innerText = distributionData.quantityDispatched;
            document.querySelector('.progress.five').classList.add('active');  // Activate only if valid data
        }

        // 6. Logistics Provider
        const logisticsData = await drugLifecycleContract.methods.logisticsProviders(blockNumber).call({ from: userAddress });
        if (logisticsData && logisticsData.logisticsProvider) {
            document.getElementById('logisticsProvider').innerText = logisticsData.logisticsProvider;
            document.getElementById('pickupDate').innerText = logisticsData.pickupDate;
            document.getElementById('pickupTime').innerText = logisticsData.pickupTime;
            document.getElementById('deliveryDate').innerText = logisticsData.deliveryDate;
            document.getElementById('deliveryTime').innerText = logisticsData.deliveryTime;
            document.querySelector('.progress.six').classList.add('active');  // Activate only if valid data
        }

        // 7. Warehouse Storage
        const warehouseData = await drugLifecycleContract.methods.warehouses(blockNumber).call({ from: userAddress });
        if (warehouseData && warehouseData.warehouseNumber) {
            document.getElementById('warehouseNumber').innerText = warehouseData.warehouseNumber;
            document.getElementById('arrivalDate').innerText = warehouseData.arrivalDate;
            document.getElementById('arrivalTime').innerText = warehouseData.arrivalTime;
            document.getElementById('warehouseName').innerText = warehouseData.warehouseName;
            document.getElementById('storageLocation').innerText = warehouseData.storageLocation;
            document.getElementById('storageConditions').innerText = warehouseData.storageConditions;
            document.querySelector('.progress.seven').classList.add('active');  // Activate only if valid data
        }

        // 8. Sent to Pharmacy
        const sentToPharmacyData = await drugLifecycleContract.methods.pharmacies(blockNumber).call({ from: userAddress });
        if (sentToPharmacyData && sentToPharmacyData.pharmacyName) {
            document.getElementById('pharmacyName').innerText = sentToPharmacyData.pharmacyName;
            document.getElementById('drugName').innerText = sentToPharmacyData.drugName;
            document.getElementById('categoryName').innerText = sentToPharmacyData.categoryName;
            document.getElementById('drugDescription').innerText = sentToPharmacyData.drugDescription;
            document.getElementById('manufactureDate').innerText = sentToPharmacyData.manufactureDate;
            document.getElementById('expiryDate').innerText = sentToPharmacyData.expiryDate;
            document.querySelector('.progress.eight').classList.add('active');  // Activate only if valid data
        }

    } catch (error) {
        console.error('Error retrieving drug lifecycle data:', error);
    }
}



// Example call to retrieve QC data for a given blockNumber
const blockNumber = drugDetails.blockNumber;
if (blockNumber) {
    retrieveDrugLifecycleDetails(blockNumber);
} else {
    console.error('Block number not found in drug details.');
}