// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/OpinionFactory.sol";

contract YourContractTest is Test {
    OpinionFactory public opinionFactory;
    address token = vm.addr(0);
    address backendWallet = vm.addr(1);
    address opinionPoolImplementation = vm.addr(2);

    function setUp() public {
        opinionFactory = new OpinionFactory(token, backendWallet, opinionPoolImplementation);
    }
}
