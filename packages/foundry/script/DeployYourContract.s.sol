//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../contracts/OpinionFactory.sol";
import "./DeployHelpers.s.sol";

contract DeployYourContract is ScaffoldETHDeploy {
    // use `deployer` from `ScaffoldETHDeploy`
    function run() external ScaffoldEthDeployerRunner {
        address token = vm.addr(0);
        address backendWallet = vm.addr(1);
        address opinionPoolImplementation = vm.addr(2);
        OpinionFactory opinionFactory = new OpinionFactory(token, backendWallet, opinionPoolImplementation);
        console.logString(string.concat("OpinionFactory deployed at: ", vm.toString(address(opinionFactory))));
    }
}
