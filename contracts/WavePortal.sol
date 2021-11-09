// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "hardhat/console.sol";
contract WavePortal {
    uint256 totalwaves;
    uint256 private seed;
    constructor() payable{
        console.log("Hi from contract console");
        seed = (block.timestamp + block.difficulty) % 100;

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
       /*
     * This is an address => uint mapping, meaning I can associate an address with a number!
     * In this case, I'll be storing the address with the last time the user waved at us.
     */
    mapping(address => uint256) public lastWavedAt;
    // kind of a post request
    function wave(string memory _message) public{
         require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );
        lastWavedAt[msg.sender] = block.timestamp;
        totalwaves+=1;
        console.log("%s has waved!", msg.sender);
        waves.push(Wave(msg.sender,_message,block.timestamp));
        //  to calculate the random number
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random number! %d", seed);
        if(seed<=50){
        console.log("%s won!", msg.sender);
        uint256 prizeAmount=0.0001 ether;
         require(prizeAmount<=address(this).balance,"Trying to withdraw more money than contract has");
         (bool success, )=(msg.sender).call{value:prizeAmount}("");
         require(success,"Failed to withdraw money from contract");
        }
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