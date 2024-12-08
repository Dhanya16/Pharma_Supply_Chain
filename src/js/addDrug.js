window.addEventListener('load', async () => {
  if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
          await ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
          console.error("User denied account access:", error);
      }
  } else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
  } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
const contractABI = [
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "drugCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
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
    "name": "drugs",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "category",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "manufacturer",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "batchNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "manufacturingDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "expiryDate",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "storageConditions",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "blockNumber",
        "type": "uint256"
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
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "category",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "manufacturer",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "batchNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "manufacturingDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "expiryDate",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "storageConditions",
        "type": "string"
      }
    ],
    "name": "addDrug",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
  const contractAddress = '0xDbc5e74E99d7204d8a65B6f3fea4DCE9A8237b7f';
    const pharmaContract = new web3.eth.Contract(contractABI, contractAddress);

    console.log(pharmaContract.methods);  // Debugging line to check available methods

    document.getElementById('add-product-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const productName = document.getElementById('product-name').value;
        const productCategory = document.getElementById('product-category').value;
        const productDescription = document.getElementById('product-description').value;
        const manufacturer = document.getElementById('manufacturer').value;
        const batchNumber = document.getElementById('batch-number').value;
        const manufacturingDate = document.getElementById('manufacturing-date').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const quantity = parseInt(document.getElementById('quantity').value);
        const storageConditions = document.getElementById('storage-conditions').value;

        // const newDrug = {
        //     name: productName,
        //     category: productCategory,
        //     description: productDescription,
        //     manufacturer: manufacturer,
        //     batchNumber: batchNumber,
        //     manufacturingDate: manufacturingDate,
        //     expiryDate: expiryDate,
        //     quantity: quantity,
        //     storageConditions: storageConditions
        // };

        try {
          const accounts = await web3.eth.getAccounts();
          const account = accounts[0];
          const receipt = await pharmaContract.methods.addDrug(
            productName,
            productCategory,
            productDescription,
            manufacturer,
            batchNumber,
            manufacturingDate,
            expiryDate,
            quantity,
            storageConditions
        ).send({ from: account });
  
          // Get block number from transaction receipt
          const blockNumber = receipt.blockNumber;
  
          // Redirect to a URL that generates the QR code with the block number
          window.location.href = `http://localhost:3002/generate-qr?blockNumber=${blockNumber}`;
            alert('Drug added to blockchain successfully!');
        } catch (error) {
            console.error("Error adding drug to blockchain:", error);
            alert('Failed to add drug to blockchain');
        }
    });
  });