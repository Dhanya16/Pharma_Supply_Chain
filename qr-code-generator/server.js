const express = require('express');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const { Web3 } = require('web3'); // Updated import

const app = express();
const port = 3000;

// Connect to Ganache
const web3 = new Web3("http://127.0.0.1:8545");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to generate QR code
app.post('/generate-qr', async (req, res) => {
    const { address } = req.body;
    if (!web3.utils.isAddress(address)) {
        return res.status(400).send('Invalid Ethereum address');
    }

    const qrCodeData = address;
    try {
        const qrCodeImage = await QRCode.toDataURL(qrCodeData);
        res.status(200).send(`<img src="${qrCodeImage}">`);
    } catch (err) {
        res.status(500).send('Error generating QR code');
    }
});

// Endpoint to get information based on account address
app.get('/info/:address', async (req, res) => {
    const { address } = req.params;
    if (!web3.utils.isAddress(address)) {
        return res.status(400).send('Invalid Ethereum address');
    }

    try {
        // Fetch information from blockchain (replace with your logic)
        const balance = await web3.eth.getBalance(address);
        res.status(200).json({ address, balance });
    } catch (err) {
        res.status(500).send('Error fetching information');
    }
});

app.listen(port, () => {
    console.log(`QR Code Generator listening at http://localhost:${port}`);
});
