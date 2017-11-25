pragma solidity ^0.4.4;

contract Wager {

	struct Bet {
		address client;
		uint amount;
		bool redWins;
	}

	struct WagerEvent {
		uint moneyPool;
		uint numBets;
		uint matchId;
		mapping(address => Bet) bets; 
	}

	mapping(uint => WagerEvent) public wagers;

	function Wager(){

	}

	function getMoneyPool(uint wagerEventId) public constant returns (uint theMoneyPool){
		return wagers[wagerEventId].moneyPool;
	}

	function getMatchId(uint wagerEventId) public constant returns (uint theMatchId){
		return wagers[wagerEventId].matchId;
	}

	function getNumBets(uint wagerEventId) public constant returns(uint theNumBets){
		return wagers[wagerEventId]. numBets;
	}

	function makeBet(uint wagerEventId, bool isRedWinner) payable {
		//storage keyword?
		wagers[wagerEventId].moneyPool += msg.value;
	}

    function checkWagerEvent(uint wagerEventId) returns (bool success) {
        return true;
    }

}




