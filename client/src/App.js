import React, { useState, useEffect } from "react";
import Bank from "./contracts/Bank.json";
import getWeb3 from "./getWeb3";

import "./App.css";

export default function App() {
  const [appData, setAppData] = useState(null);
  const [depositForm, setDepositForm] = useState({name: '', amount: 0});

  useEffect(() => {
    (async function() {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
  
        const [address] = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Bank.networks[networkId];
        const contract = new web3.eth.Contract(
          Bank.abi,
          deployedNetwork.address,
        );

        setAppData({ web3, contract, address });
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    })();
  }, []);

  function listenToSuccessfulDeposit() {
    const { contract } = appData;
    contract.events.SuccessfulDeposit({}, (error, event) => {
      if (error) console.log(error);
      else console.log(event);
    });
  }

  function onChange(event) {
    const { name, value } = event.target;
    setDepositForm(previousState => ({...previousState, [name]: value}));
  }

  async function onSubmit(event) {
    event.preventDefault();

    listenToSuccessfulDeposit();

    const { name, amount } = depositForm;
    const { contract, address } = appData;

    await contract.methods.storePayment(name).send({ from: address, value: amount });
  }

  return (
    appData ?
      <div className="app">
        <h1>Deposit Form</h1>
        <form onSubmit={onSubmit}>
          <div>
            <label>Name:</label>
            <input name="name" id="name" value={depositForm.name} onChange={onChange}/>
          </div>
          <div>
            <label>Amount:</label>
            <input name="amount" id="amount" value={depositForm.amount} onChange={onChange}/>
          </div>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div> :
      <div>loading...</div>
  );
}
