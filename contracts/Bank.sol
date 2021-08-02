pragma solidity >=0.4.21 <0.7.0;

contract Bank {
  mapping (address => Account) accounts;

  struct Account {
    uint balance;
    string messageHistory;
    bool exists;
  }

  event SuccessfulDeposit(uint amount, uint smartContractBalance);

  function storePayment(string memory name) public payable {
    uint amount = msg.value;
    address payable user = msg.sender;

    if (accounts[user].exists) {
      accounts[user].balance += amount;
    } else {
      Account memory newAccount = Account(amount, name, true);
      accounts[user] = newAccount;
    }

    emit SuccessfulDeposit(amount, address(this).balance);
  }
}