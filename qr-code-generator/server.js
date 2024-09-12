const express = require('express');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const { Web3 } = require('web3');
const abiDecoder = require('abi-decoder'); // A library to decode ABI-encoded data

const app = express();
const port = 3002;

// Connect to Ganache
const web3 = new Web3("http://127.0.0.1:7545");

// ABI of your smart contract
const abi = [
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
          "components": [
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
          "internalType": "struct AddDrug.Drug",
          "name": "newDrug",
          "type": "tuple"
        }
      ],
      "name": "addDrug",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

// Initialize the ABI decoder with your contract's ABI
abiDecoder.addABI(abi);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));
// Function to handle BigInt conversion
function replacer(key, value) {
    return typeof value === 'bigint' ? value.toString() : value;
}

// Endpoint to generate QR code with detailed information
app.get('/generate-qr', async (req, res) => {
  const { blockNumber } = req.query;
  if (!Number.isInteger(Number(blockNumber)) || blockNumber < 0) {
      return res.status(400).send('Invalid block number');
  }

  try {
      const block = await web3.eth.getBlock(Number(blockNumber), true);
      if (!block || !block.transactions.length) {
          return res.status(404).send('No transactions found in this block');
      }

      const transaction = block.transactions[0];
      const decodedData = abiDecoder.decodeMethod(transaction.input);

      if (!decodedData) {
          return res.status(400).send('Could not decode transaction data');
      }

      const data = JSON.stringify(decodedData.params.map(param => param.value), replacer);
      const qrCodeUrl = `http://localhost:${port}/scanQr.html?data=${encodeURIComponent(data)}`;

      // Generate QR Code
      const qrCodeImage = await QRCode.toDataURL(qrCodeUrl);

      // Redirect to display.html with the QR code image data
      res.redirect(`/displayQr.html?qrCode=${encodeURIComponent(qrCodeImage)}&blockNumber=${blockNumber}`);
  } catch (err) {
      console.error('Error generating QR code:', err.message);
      res.status(500).send('Error generating QR code');
  }
});



// Endpoint to get block information based on QR code identifier
app.get('/block-info/:identifier', async (req, res) => {
  const { identifier } = req.params;

  const blockNumberMatch = identifier.match(/block:(\d+)/);
  if (!blockNumberMatch) {
      return res.status(400).send('Invalid identifier format');
  }

  const blockNumber = parseInt(blockNumberMatch[1], 10);
  
  try {
      const block = await web3.eth.getBlock(blockNumber, true);
      if (!block) {
          return res.status(404).send('Block not found');
      }

      const transaction = block.transactions[0]; // Assuming the first transaction is relevant
      console.log(block.transactions[0]);
      const decodedData = abiDecoder.decodeMethod(transaction.input);

      if (!decodedData) {
          return res.status(400).send('Could not decode transaction data');
      }

      // Extract only the `value` of the `newDrug` parameter
      const drugDetails = decodedData.params.find(param => param.name === 'newDrug').name;

      // Send back only the drug details
      res.status(200).json({
          drugDetails
      });
  } catch (err) {
      console.error('Error fetching block information:', err.message);
      res.status(500).send('Error fetching block information');
  }
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});