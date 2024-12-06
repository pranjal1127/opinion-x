// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { OwnableUpgradeable } from
  "@openzeppelin-upgradeable/access/OwnableUpgradeable.sol";

contract OpinionPool is OwnableUpgradeable {
  // Struct to represent an option in the prediction market
  struct Option {
    string name;
    uint256 shares;
  }

  uint256 public constant BASE_PRICE = 10 * 1e18;
  uint256 public constant INITIAL_TOKEN_ALLOCATION = 1000 * 1e18;

  IERC20 public token;
  string public name;
  uint256 public totalOptions;
  uint256 public totalShares;

  // Mapping of options
  mapping(uint256 => Option) public options;
  mapping(address => mapping(uint256 => uint256)) public userShares;

  // Events
  event OptionCreated(uint256 indexed optionId, string name);
  event SharesBought(
    address indexed user, uint256 indexed optionId, uint256 amount, uint256 cost
  );
  event SharesSold(
    address indexed user,
    uint256 indexed optionId,
    uint256 amount,
    uint256 profit
  );

  // Initialization function (replaces constructor)
  function initialize(
    address _token,
    string memory _name,
    string[] memory _optionNames
  ) public initializer {
    // uint256 totalAllocation = INITIAL_TOKEN_ALLOCATION * _optionNames.length;
    __Ownable_init(msg.sender);
    token = IERC20(_token);
    name = _name;
    for (uint256 i = 0; i < _optionNames.length; i++) {
      _createOption(_optionNames[i]);
    }
  }

  function _createOption(string memory _name) internal {
    uint256 optionId = totalOptions;
    Option storage newOption = options[optionId];
    newOption.name = _name;
    newOption.shares = INITIAL_TOKEN_ALLOCATION;
    totalOptions++;
    totalShares += INITIAL_TOKEN_ALLOCATION;

    options[optionId] = newOption;
  }

  function _quotePrice(
    uint256 _optionId,
    uint256 _amount,
    bool _isBuy
  ) internal view returns (uint256) {
    require(_optionId < totalOptions, "Invalid option");

    Option storage option = options[_optionId];
    uint256 share = option.shares;
    uint256 price = 0;
    if (_isBuy) {
      price = (share + _amount) * BASE_PRICE / (totalShares + _amount);
    } else {
      if (share < _amount) {
        return 0;
      }
      price = (share - _amount) * BASE_PRICE / (totalShares - _amount);
    }

    return price;
  }

  // Calculate the price for buying shares
  function quote(
    uint256 _optionId,
    uint256 _amount,
    bool _isBuy
  ) public view returns (uint256) {
    require(_optionId < totalOptions, "Invalid option");

    return _quotePrice(_optionId, _amount, _isBuy) * _amount;
  }

  // Buy shares of an option
  function buyOption(uint256 _optionId, uint256 _amount) public {
    require(_optionId < totalOptions, "Invalid option");

    // Calculate the cost
    uint256 cost = _quotePrice(_optionId, _amount, true) * _amount / 1e18;
    // Update option shares

    if (cost == 0) {
      revert("PRICE_ZERO");
    }
    Option storage option = options[_optionId];
    option.shares += _amount;
    totalShares += _amount;
    userShares[msg.sender][_optionId] += _amount;

    // Transfer tokens from user to contract
    token.transferFrom(msg.sender, address(this), cost);

    emit SharesBought(msg.sender, _optionId, _amount, cost);
  }

  // Sell shares of an option
  function sellOption(uint256 _optionId, uint256 _amount) public {
    require(_optionId < totalOptions, "Invalid option");

    Option storage option = options[_optionId];

    uint256 currentShares = userShares[msg.sender][_optionId];
    require(currentShares >= _amount, "Insufficient shares");

    uint256 sellPrice = _quotePrice(_optionId, _amount, false) / 1e18;

    if (sellPrice == 0) {
      revert("PRICE_ZERO");
    }

    // Update option shares
    option.shares -= _amount;
    totalShares -= _amount;
    userShares[msg.sender][_optionId] -= _amount;

    // Transfer tokens from contract to user
    token.transfer(msg.sender, sellPrice * _amount);

    emit SharesSold(msg.sender, _optionId, _amount, sellPrice * _amount);
  }

  // Get user's shares for a specific option
  function getUserShares(address _user) public view returns (uint256[] memory) {
    uint256[] memory userOptionShares = new uint256[](totalOptions);
    for (uint256 i = 0; i < totalOptions; i++) {
      userOptionShares[i] = userShares[_user][i];
    }
    return userOptionShares;
  }

  function getAllOptionQuotes(bool _isBuy)
    public
    view
    returns (uint256[][] memory)
  {
    uint256[][] memory quotes = new uint256[][](totalOptions);
    for (uint256 i = 0; i < totalOptions; i++) {
      // array where first element is name of option and second is price of option
      quotes[i] = new uint256[](2);
      quotes[i][0] = i; // Assuming the name of the option is represented by its index
      quotes[i][1] = _quotePrice(i, 1, _isBuy);
    }
    return quotes;
  }
}
