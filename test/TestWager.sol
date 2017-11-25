pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Wager.sol";

contract TestWager {

	Wager wager = Wager(DeployedAddresses.Wager());

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