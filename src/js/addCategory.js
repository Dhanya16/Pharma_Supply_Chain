
window.addEventListener('load', async () => {
    // Modern dapp browsers
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access
            await ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            console.error("User denied account access");
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
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "categories",
        "outputs": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "categoryCount",
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
        "constant": false,
        "inputs": [
          {
            "internalType": "string",
            "name": "_name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_description",
            "type": "string"
          }
        ],
        "name": "addCategory",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];
    const contractAddress = "0xB0F57A724522810cE164D76e15A397963d0Ca47d";
    const pharmaContract = new web3.eth.Contract(contractABI, contractAddress);

    document.getElementById('add-category-form').addEventListener('submit', async function (event) {
        event.preventDefault();
        const categoryName = document.getElementById('category-name').value;
        const categoryDescription = document.getElementById('category-description').value;

        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];

        try {
            await pharmaContract.methods.addCategory(categoryName, categoryDescription).send({ from: account });
            alert('Category added to blockchain successfully!');
        } catch (error) {
            console.error("Error adding category to blockchain:", error);
            alert('Failed to add category to blockchain');
        }
    });
});
