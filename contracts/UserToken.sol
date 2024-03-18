// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; 

contract UserToken is ERC20 {
    string private _name;
    uint256 private _price;
    uint256 private _maxSupply;
    uint256 private _totalSupply;

    constructor(string memory name, uint256 price, uint256 maxSupply) ERC20(name, name) {
        _name = name;
        _price = price;
        _maxSupply = maxSupply;
        _totalSupply = 0;
    }

    // function name() public view returns (string memory) {
    //     return _name;
    // }

    function price() public view returns (uint256) {
        return _price;
    }

    function maxSupply() public view returns (uint256) {
        return _maxSupply;
    }

    // function totalSupply() public view returns (uint256) {
    //     return _totalSupply;
    // }

    function mint(address account, uint256 amount) public {
        require(_totalSupply + amount <= _maxSupply, "Exceeds max supply");
        _mint(account, amount);
        _totalSupply += amount;
    }
}
