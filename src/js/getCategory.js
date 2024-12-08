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
    const contractAddress = '0x08035E25E41fE0363a0097591EFAd1Bf4baA6021';
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    async function populateCategories() {
        const categoryCount = await contract.methods.categoryCount().call();
        const container = document.getElementById('category-container');
        for (let i = 1; i <= categoryCount; i++) {
            const category = await contract.methods.categories(i).call();
            const categoryCard = `
            <div class="col-md-3">
                <a href="adminDrug.html?category=${encodeURIComponent(category.name)}">
                    <div class="category-card">
                        <div class="card-body">
                            <h5 class="card-title">${category.name}</h5>
                        </div>
                    </div>
                </a>
            </div>
        `;
            container.insertAdjacentHTML('beforeend', categoryCard);
        }
    }
    populateCategories().catch(console.error);

});