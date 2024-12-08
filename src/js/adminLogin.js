if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    alert('MetaMask is not detected! Please install MetaMask to use this dApp.');
}
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
]; 
let contractAddress = "0xbCf58d7201De577a0134C3fCDAFfE20D1cC5c0FE"; 

supplyChain = new web3.eth.Contract(abi, contractAddress);
async function signIn() {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const currentAccount = accounts[0]; 
        
        const isAdmin = await supplyChain.methods.isAdmin(currentAccount).call();

        if (isAdmin) {
            console.log('Admin logged in with Ethereum account:', currentAccount);
            window.location.href = 'adminDashboard.html';
        } else {
            alert('You are not authorized to access this admin portal.');
        }
    } catch (error) {
        console.error('Error while signing in with MetaMask:', error);
    }
}
