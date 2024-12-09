// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserInfo {
  uint256 public age;
  string public name;
  bool public isActive;
  address public owner;

  struct User {
    string name;
    bool active;
    uint256 age;
  }

  function setUserInfo(string memory _name, uint256 _age) internal {
    name = _name;
    age = _age;
    owner = msg.sender;

  }

  modifier isOwner() {
    require(msg.sender == owner, "Only the owner can do this");
    _;
  }

  // function getUserInfo() public view returns(User) {
  //   return User;
  // }
}