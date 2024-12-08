window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else {
        alert('Please install MetaMask!');
        return;
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
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    async function populateDrugs() {
        const drugCount = await contract.methods.drugCount().call();
        const container = document.getElementById('drug-container');
        for (let i = 1; i <= drugCount; i++) {
            const drug = await contract.methods.drugs(i).call();
            if (drug.category === category) {
                const drugCard = `
                    <tr>
                                <td>${drug.batchNumber}</td>
                                <td>${drug.name}</td>
                                <td>${drug.description}</td>
                                <td>${drug.manufacturingDate}</td>
                                <td>${drug.expiryDate}</td>
                                <td>${drug.quantity}</td>
                                <td>${drug.storageConditions}</td>
                            </tr>
                `;
                container.insertAdjacentHTML('beforeend', drugCard);
            }
        }
    }
    populateDrugs().catch(console.error);
});
