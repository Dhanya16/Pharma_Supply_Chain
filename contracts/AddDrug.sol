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
    }

    mapping(uint => Drug) public drugs;
    uint public drugCount;

    constructor() public {
        drugCount = 0; // Initialize drug count
    }

    function addDrug(
        Drug memory newDrug
    ) public {
        drugCount++;
        drugs[drugCount] = newDrug;
    }
}
