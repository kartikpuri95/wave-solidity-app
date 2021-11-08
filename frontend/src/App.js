import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";
import constructionimg from "./assets/Construction.gif"
import './App.css';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isminting, setIsMinting] = useState(false);
  const contractAddress = "0x09A018eEB6e13150821EA340717cF412f2F1bdf9";
  const contractABI = abi.abi;
  const checkIfWalletIsConnected = async () => {
    /*
    * First make sure we have access to window.ethereum
    */
    try {


      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      // check if we are authorized
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length != 0) {
        const account = accounts[0]
        console.log("Found authorized account")
        setCurrentAccount(account)
      }
      else {
        console.log("No authorized account found")
      }
    }
    catch (err) {
      console.log(err)
    }
  }
  // Connect to wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("get metamask")
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }
  const wave = async () => {
    try {
      setIsMinting(true)
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        // How to connect to the created contract
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        // Get the count of total waves
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        // Send the transaction
        const wavetxn = await wavePortalContract.wave();
        
        console.log("Mining",wavetxn.hash)
      // Wait for the transaction to complete
        await wavetxn.wait();
        console.log("Minted--" , wavetxn.hash)
        setIsMinting(false)
       count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      }
      else {
        console.log("Ethereum object doesn't exist!");
      }
    }
    catch (error) {
      console.log(error)
    }
  }
  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      { !isminting && (<div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          I am Kartik and I am learning blockchain tech so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>)}
      {isminting &&(
        <div className="dataContainer">
        <div className="bio">
         Mining
        </div>
          <img src={constructionimg}/>
        </div>

      )}
    </div>
  );
}

export default App