// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "hardhat/console.sol";
contract WavePortal {
    uint256 totalwaves;
    constructor(){
        console.log("Hi from contract console");
    }
    // Unlike any other evnts 
    event NewWave(address indexed from, uint256 timestamp,string message);
    // Struct wave
    struct Wave{
        address waver;
        string message;
        uint256 timestamp;
    }
    // Decalare variable waves from new struct
    Wave[] waves;
    // kind of a post request
    function wave(string memory _message) public{
        totalwaves+=1;
         console.log("%s has waved!", msg.sender);
         waves.push(Wave(msg.sender,_message,block.timestamp));
         emit NewWave(msg.sender, block.timestamp, _message);
    }
    // get all waves
    function getAllWaves() public view returns(Wave[] memory){
        return waves;
    }
    // kind of a get request
    function getTotalWaves() public view returns(uint256){
        console.log("We have %d total waves",totalwaves);
        return totalwaves;
    }
    
}