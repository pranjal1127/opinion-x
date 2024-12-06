// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {OpinionPool} from "./OpinionPool.sol";

contract OpinionFactory is Ownable {
    ERC20 public token;
    address public backendWallet;
    address public opinionPoolImplementation;

    uint256 public constant INITIAL_TOKEN_ALLOCATION = 1000 * 1e18;

    modifier onlyBackend() {
        require(msg.sender == backendWallet, "OpinionFactory: caller is not the backend");
        _;
    }

    event OpinionPoolCreated(address indexed opinionPool, string name, string[] optionNames);
    event BackendWalletChanged(address indexed previousWallet, address indexed newWallet);
    event OpinionPoolImplementationChanged(address indexed previousImplementation, address indexed newImplementation);

    constructor(address _token, address _backendWallet, address _opinionPoolImplementation) Ownable(msg.sender) {
        backendWallet = _backendWallet;
        opinionPoolImplementation = _opinionPoolImplementation;

        token = ERC20(_token);
    }

    function changeBackendWallet(address _newWallet) external onlyOwner {
        emit BackendWalletChanged(backendWallet, _newWallet);
        backendWallet = _newWallet;
    }

    function changeOpinionPoolImplementation(address _newImplementation) external onlyOwner {
        emit OpinionPoolImplementationChanged(opinionPoolImplementation, _newImplementation);
        opinionPoolImplementation = _newImplementation;
    }

    // Function to create a new OpinionPool contract
    function createOpinionPool(string memory _name, string[] memory _optionNames)
        external
        onlyBackend
        returns (address)
    {
        bytes32 salt = keccak256(abi.encodePacked(block.timestamp));

        address opinionPool = LibClone.cloneDeterministic(opinionPoolImplementation, salt);

        OpinionPool(opinionPool).initialize(address(token), _name, _optionNames);

        // transfer funds to the new opinion pool
        uint256 totalAllocation = INITIAL_TOKEN_ALLOCATION * _optionNames.length;
        try token.transferFrom(msg.sender, opinionPool, totalAllocation) {
            emit OpinionPoolCreated(opinionPool, _name, _optionNames);
        } catch {
            revert("OpinionFactory: TRANSFER_FAILED");
        }

        return opinionPool;
    }
}
