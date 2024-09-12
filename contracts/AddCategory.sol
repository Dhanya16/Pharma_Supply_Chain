pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract AddCategory {
    struct CategoryDetails {
        string name;
        string description;
    }

    mapping(uint => CategoryDetails) public categories;
    uint public categoryCount;

    constructor() public {
        categoryCount = 0; // Initialize category count
    }

    function addCategory(string memory _name, string memory _description) public {
        categoryCount++;
        categories[categoryCount] = CategoryDetails(_name, _description);
    }
}