//SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
   
    constructor(string memory tokenName_,string memory tokenSymbol_,uint256 amount_,address minter_) ERC20(tokenName_ , tokenSymbol_) {
        
        _mint(minter_, amount_*1e18);      // TODO: change to correct supply
        
    }

}

