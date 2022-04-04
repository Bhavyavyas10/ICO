// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

contract SimpleStorage {
  uint public storedData;

  constructor(uint a_) {
    storedData = a_;
  }

  function set(uint x) public {
    storedData = x;
  }

}
