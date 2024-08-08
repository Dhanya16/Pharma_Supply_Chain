// Ensure web3 is injected and available from MetaMask
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // Handle cases where MetaMask is not available
    alert('MetaMask is not detected! Please install MetaMask to use this dApp.');
}
// Load the compiled contract ABI and deployed address
let abi = [
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
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "admins",
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
          "internalType": "address",
          "name": "_address",
          "type": "address"
        }
      ],
      "name": "isAdmin",
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
      "constant": false,
      "inputs": [],
      "name": "adminFunction",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]; // Replace with your actual ABI array from PharmaSupplyChain.json
let contractAddress = "0xB0C8E1659C70400db40C365d1438aACdDBF6188e"; // Replace with your deployed contract address

// Instantiate the contract
supplyChain = new web3.eth.Contract(abi, contractAddress);
// Example function to authenticate admin using MetaMask
async function signIn() {
    try {
        // Request MetaMask to connect and get the current account
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const currentAccount = accounts[0]; // Assuming the user selects the first account
        
        // Check if the current account is one of the predefined admin addresses
        const isAdmin = await supplyChain.methods.isAdmin(currentAccount).call();

        if (isAdmin) {
            // Admin is authenticated, proceed to admin dashboard or functionality
            console.log('Admin logged in with Ethereum account:', currentAccount);
            // Redirect to admin dashboard or perform admin-specific actions
            window.location.href = 'adminDashboard.html';
        } else {
            // Handle case where the current account is not an admin
            alert('You are not authorized to access this admin portal.');
        }
    } catch (error) {
        // Handle error (e.g., user denied account access)
        console.error('Error while signing in with MetaMask:', error);
    }
}
