pragma solidity ^0.5.16;

contract DrugLifecycle {
    struct QualityControl {
        string testId;
        string testDate;
        string testTime;
        string testerName;
        string result;
    }

    struct Packaging {
        string packageBatch;
        string packageDate;
        string packageTime;
        uint quantityPackaged;
        string packagingFacility;
    }

    struct LabTesting {
        string labTestId;
        string labTestDate;
        string labTestTime;
        string labName;
        string testerName;
        string result;
    }

    struct Distribution {
        string distributionBatch;
        string distributorName;
        string dispatchDate;
        string dispatchTime;
        uint quantityDispatched;
    }

    struct Logistics {
        string logisticsProvider;
        string pickupDate;
        string pickupTime;
        string deliveryDate;
        string deliveryTime;
    }

    struct Warehouse {
        string warehouseNumber;
        string arrivalDate;
        string arrivalTime;
        string warehouseName;
        string storageLocation;
        string storageConditions;
    }

    struct Pharmacy {
        string pharmacyName;
        string drugName;
        string categoryName;
        string drugDescription;
        string manufactureDate;
        string expiryDate;
    }
    mapping(uint256 => QualityControl) public qualityControls;
    mapping(uint256 => Packaging) public packagings;
    mapping(uint256 => LabTesting) public labTests;
    mapping(uint256 => Distribution) public distributions;
    mapping(uint256 => Logistics) public logisticsProviders;
    mapping(uint256 => Warehouse) public warehouses;
    mapping(uint256 => Pharmacy) public pharmacies;

    mapping(uint256 => mapping(uint256 => bool)) public lockedBoxes;

    function addQualityControl(uint256 blockNumber, string memory testId, string memory testDate, string memory testTime, string memory testerName, string memory result) public {
        qualityControls[blockNumber] = QualityControl(testId, testDate, testTime, testerName, result);
        lockedBoxes[1][blockNumber] = true;
        if (keccak256(abi.encodePacked(result)) == keccak256(abi.encodePacked("Failed"))) {
        for (uint256 i = 2; i <= 7; i++) {
            lockedBoxes[i][blockNumber] = true;
        }
    }
    }

    function addPackaging(uint256 blockNumber, string memory packageBatch, string memory packageDate, string memory packageTime, uint quantityPackaged, string memory packagingFacility) public {
        packagings[blockNumber] = Packaging(packageBatch, packageDate, packageTime, quantityPackaged, packagingFacility);
        lockedBoxes[2][blockNumber] = true;
    }

    function addLabTesting(uint256 blockNumber, string memory labTestId, string memory labTestDate, string memory labTestTime, string memory labName, string memory testerName, string memory result) public {
        labTests[blockNumber] = LabTesting(labTestId, labTestDate, labTestTime, labName, testerName, result);
        lockedBoxes[3][blockNumber] = true;
        if (keccak256(abi.encodePacked(result)) == keccak256(abi.encodePacked("Failed"))) {
        for (uint256 i = 4; i <= 7; i++) {
            lockedBoxes[i][blockNumber] = true;
        }
    }
    }

    function addDistribution(uint256 blockNumber, string memory distributionBatch, string memory distributorName, string memory dispatchDate, string memory dispatchTime, uint quantityDispatched) public {
        distributions[blockNumber] = Distribution(distributionBatch, distributorName, dispatchDate, dispatchTime, quantityDispatched);
        lockedBoxes[4][blockNumber] = true;
    }

    function addLogistics(uint256 blockNumber, string memory logisticsProvider, string memory pickupDate, string memory pickupTime, string memory deliveryDate, string memory deliveryTime) public {
        logisticsProviders[blockNumber] = Logistics(logisticsProvider, pickupDate, pickupTime, deliveryDate, deliveryTime);
        lockedBoxes[5][blockNumber] = true;
    }

    function addWarehouse(uint256 blockNumber, string memory warehouseNumber, string memory arrivalDate, string memory arrivalTime, string memory warehouseName, string memory storageLocation, string memory storageConditions) public {
        warehouses[blockNumber] = Warehouse(warehouseNumber, arrivalDate, arrivalTime, warehouseName, storageLocation, storageConditions);
        lockedBoxes[6][blockNumber] = true;
    }

    function addPharmacy(uint256 blockNumber, string memory pharmacyName, string memory drugName, string memory categoryName, string memory drugDescription, string memory manufactureDate, string memory expiryDate) public {
        pharmacies[blockNumber] = Pharmacy(pharmacyName, drugName, categoryName, drugDescription, manufactureDate, expiryDate);
        lockedBoxes[7][blockNumber] = true;
    }
}
