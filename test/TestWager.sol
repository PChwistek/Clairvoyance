pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Wager.sol";

contract TestWager {

	Wager wager = Wager(DeployedAddresses.Wager());
	uint wagerEventId;


  	function testNewWagerEvent(){
  		/*uint matchId = 100;
  		wager.newWagerEvent(matchId);
  		uint expected = 1;

  		Assert.equal(expected, expected, "wagerEventId should be 1");*/
  		
  	}

	// Truffle will send the TestContract one Ether after deploying the contract.
  	//uint public initialBalance = 1 ether;

  	/*function testInitialBalanceUsingDeployedContract() {
	    MyContract myContract = MyContract(DeployedAddresses.MyContract());

    	// perform an action which sends value to myContract, then assert.
    	myContract.send(...);
  	} */

	//Test constructor
	function testGetMatchId(){

		/*
		uint returnedId = wager.getMatchId();
		uint expected = 0; 
		Assert.equal(returnedId, expected, "MatchId should be 0");
		*/

	}

	function testGetMoneyPool(){

		/*
		uint returnedPool = wager.getMoneyPool();
		uint expected = 0;
		Assert.equal(returnedPool, expected, "Money pool should be 0");
		*/

	}

	function testGetNumBets(){
		/*
		uint returnedPool = wager.getNumBets();
		uint expected = 0;
		Assert.equal(returnedPool, expected, "Number of bets should be 0");
		*/
	}

}