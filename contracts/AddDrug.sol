pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract AddDrug {
    struct Drug {
        string name;
        string category;
        string description;
        string manufacturer;
        string batchNumber;
        string manufacturingDate;
        string expiryDate;
        uint quantity;
        string storageConditions;
        uint blockNumber; // New field to store block number
    }

    mapping(uint => Drug) public drugs;
    uint public drugCount;

    constructor() public {
        drugCount = 0; // Initialize drug count
    }

    function addDrug(
        string memory name,
        string memory category,
        string memory description,
        string memory manufacturer,
        string memory batchNumber,
        string memory manufacturingDate,
        string memory expiryDate,
        uint quantity,
        string memory storageConditions
    ) public {
        drugCount++;

        // Store the drug details along with the current block number
        drugs[drugCount] = Drug({
            name: name,
            category: category,
            description: description,
            manufacturer: manufacturer,
            batchNumber: batchNumber,
            manufacturingDate: manufacturingDate,
            expiryDate: expiryDate,
            quantity: quantity,
            storageConditions: storageConditions,
            blockNumber: block.number // Capture the current block number
        });
    }
}