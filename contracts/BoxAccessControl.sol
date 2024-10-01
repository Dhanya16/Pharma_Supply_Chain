// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract BoxAccessControl {
    mapping(uint => address) public boxAddresses; // Map box numbers to addresses

    constructor() public {
        // Initialize box addresses (replace with actual addresses)
        boxAddresses[1] = 0xBaeCF44A36291552DaDDACD14476425F29408eDB; // Box 1 Address
        boxAddresses[2] = 0xaf5C53C43D90b9081303930384C15565bEAbdDBC; // Box 2 Address
        boxAddresses[3] = 0xd5a08c1bA7cBEbb818c63df665F87f5e6ca30185; // Box 3 Address
        boxAddresses[4] = 0x27E5DB176E2929F6593954093D3BEe0735452C08; // Box 4 Address
        boxAddresses[5] = 0x902f809Dc061751abB60D9B5E0F85FdA4F1EAb79; // Box 5 Address
        boxAddresses[6] = 0x582aEc35daC3f94F29fA5bF70D204972280be0Ee; // Box 6 Address
        boxAddresses[7] = 0xaB0E868dB39AF9A250F112B51ae1190f610411ED; // Box 7 Address
    }

    function isAuthorized(uint boxNumber, address _address) public view returns (bool) {
        return boxAddresses[boxNumber] == _address;
    }
}
