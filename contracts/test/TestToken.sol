// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestToken is ERC20, Ownable {
    uint8 decimal;

    constructor(string memory _name, string memory _symbol, uint8 _decimal)
        ERC20(_name, _symbol)
    {
        _mint(msg.sender, 1000000000000000000000000000000);
        decimal=_decimal;
    }

    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }

    function decimals() public view override returns (uint8) {
        return decimal;
    }
}
