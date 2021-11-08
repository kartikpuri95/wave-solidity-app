import React, { useEffect, useState } from "react";
import { ethers, providers } from "ethers";
import abi from "./utils/WavePortal.json";
import constructionimg from "./assets/Construction.gif"
import './App.css';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isminting, setIsMinting] = useState(false);
  const [allWaves, setAllWaves] = useState([]);
  const [message,setMessage] = useState('');
  const contractAddress = "0x3A254AAb11d9E144263E711A714976326a2150dd";
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
        getAllWaves();
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
        const wavetxn = await wavePortalContract.wave(message);

        console.log("Mining", wavetxn.hash)
        // Wait for the transaction to complete
        await wavetxn.wait();
        console.log("Minted--", wavetxn.hash)
        setIsMinting(false)
        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        getAllWaves()
      }
      else {
        console.log("Ethereum object doesn't exist!");
      }
    }
    catch (error) {
      console.log(error)
    }
  }
  // Get all waves and message
  const getAllWaves = async () => {
    const { ethereum } = window
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner()
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      const waves = await wavePortalContract.getAllWaves();
      let wavesCleaned = [];
      waves.forEach(wave => {
        wavesCleaned.push({
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message
        });
      });
      setAllWaves(wavesCleaned);
    }
  }
  /*
  * This runs our function when the page loads.
  */ const handleChange = (e)=>{
    setMessage(e.target.value);
  }
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      {!isminting && (<div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          I am Kartik and I am learning blockchain tech so that's pretty cool right? Connect your Ethereum wallet and wave at me!
          <div className="omrs-input-group">
				<label className="omrs-input-filled">
				  <input onChange={handleChange} value={message} required/>
				  <span className="omrs-input-label">Message</span>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><circle cx="15.5" cy="9.5" r="1.5"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-5-6c.78 2.34 2.72 4 5 4s4.22-1.66 5-4H7z"/></svg>
				</label>
			</div>
        </div>
      
        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
        <div className="">
        {allWaves.map((wave, index) => {
        return (
          <div key={index} className="bio" style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
            <div>Address: {wave.address}</div>
            <div>Time: {wave.timestamp.toString()}</div>
            <div>Message: {wave.message}</div>
          </div>)
      })}
      </div>
        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>)}
    
      {isminting && (
        <div className="dataContainer">
          <div className="bio">
            Mining
          </div>
          <img src={constructionimg} />
        </div>

      )}
    
    </div>
  );
}

export default App