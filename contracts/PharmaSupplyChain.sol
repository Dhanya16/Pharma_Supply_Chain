pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract PharmaSupplyChain {
    mapping(address => bool) public admins;

    constructor() public {
        // Initialize admin addresses
        admins[0x3f188c173a0ba3fCd388fd23dF301E9aAB608a1a] = true; // Admin1
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admins can perform this action");
        _;
    }
    function isAdmin(address _address) public view returns (bool) {
        return admins[_address];
    }

    // Example admin function
    function adminFunction() public onlyAdmin {
        // Admin specific functionality
    }

}