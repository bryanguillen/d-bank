pragma solidity >=0.4.21 <0.7.0;

contract Bank {
  mapping (address => Account) accounts;

  struct Account {
    uint balance;
    string messageHistory;
    bool exists;
  }

  event SuccessfulDeposit(uint amount, uint smartContractBalance, uint newAccountBalance);
  event SuccessfulWithdraw(uint amount, uint remainingBalance);

  function storePayment(string memory name) public payable {
    uint amount = msg.value;
    address payable user = msg.sender;

    if (accounts[user].exists) {
      accounts[user].balance += amount;
    } else {
      Account memory newAccount = Account(amount, name, true);
      accounts[user] = newAccount;
    }

    /**
     * When to use an event versus return?
     */
    emit SuccessfulDeposit(amount, address(this).balance, accounts[user].balance);
  }

  function withdraw(uint amount) public {
    address payable user = msg.sender;
    
    // add some require statements to make this safe

    // send
    user.transfer(amount);

    // deduct from balance
    accounts[user].balance -= amount;

    // emit event
    emit SuccessfulWithdraw(amount, accounts[user].balance);
  }
}