pragma solidity ^0.4.4;

contract owned {

	address public owner;

	function owned() public {
		owner = msg.sender;
	}

	modifier onlyOwner {
		require(msg.sender == owner);
		_;
	}

	function transferOwnership(address newOwner) public onlyOwner {
		owner = newOwner;
	}
}

contract Wager is owned {

	struct Bet {
		address clientAddr;
		uint amount;
		bool redWins;
	}

	struct WagerEvent {
		uint moneyPoolFor;
		uint moneyPoolAgainst;
		uint numBetsFor;
		uint numBetsAgainst;
		uint matchId;
		bool takingBets; 
		mapping(uint => Bet) betsFor; 
		mapping(uint => Bet) betsAgainst;
	}

	event TakingBets(uint _wagerEventId, bool _isBetting);
	event MakeBet(address _better, uint amount, uint _wagerEventId, uint clientId, bool _redWins);
	event Outcome(address _better, uint amount, uint wagerEventId, bool won);

	mapping(uint => WagerEvent) public wagers;
	uint numWagerEvents;

	function newWagerEvent(uint aMatchId) public onlyOwner {
		uint wagerEventId = numWagerEvents++;
		wagers[wagerEventId] = WagerEvent(0, 0, 0, 0, aMatchId, true);
		TakingBets(wagerEventId, true);
	}

	function makeBet(uint wagerEventId, bool thinksRedWinner) public payable returns (bool success){
	    WagerEvent storage w = wagers[wagerEventId];
		require(w.takingBets == true);

		if(thinksRedWinner){
			w.betsFor[w.numBetsFor++] = Bet(msg.sender, msg.value, thinksRedWinner);
			w.moneyPoolFor += msg.value;
			MakeBet(msg.sender, msg.value, wagerEventId, w.numBetsFor, thinksRedWinner);

		} else {
			w.betsAgainst[w.numBetsAgainst++] = Bet(msg.sender, msg.value, thinksRedWinner);
			w.moneyPoolAgainst += msg.value;
			MakeBet(msg.sender, msg.value, wagerEventId, w.numBetsAgainst, thinksRedWinner);
		}

		return true;
	}

	function stopBetting(uint wagerEventId) public onlyOwner {
	    require(wagers[wagerEventId].takingBets == true);
		WagerEvent storage w = wagers[wagerEventId];
		w.takingBets = false;
		TakingBets(wagerEventId, w.takingBets);
	}

    function distributeMoney(uint wagerEventId , bool redWon) public onlyOwner returns (bool success) {
    	WagerEvent storage w = wagers[wagerEventId]; 
    	uint totalMoneyPool = w.moneyPoolFor + w.moneyPoolAgainst;
    	require(w.moneyPoolFor > 0 && w.moneyPoolAgainst > 0 && totalMoneyPool > 0);
    	require(w.takingBets == false);

    	uint moneyPoolRemaining = totalMoneyPool;
    	uint moneyToDistribute;

    	if(redWon){ // this is ugly, but it works

	    	for(uint i = 0; i < w.numBetsFor; i++){
	    		moneyToDistribute = (w.betsFor[i].amount * totalMoneyPool) / w.moneyPoolFor;
	    		w.betsFor[i].clientAddr.transfer(moneyToDistribute);
    		    moneyPoolRemaining = moneyPoolRemaining - moneyToDistribute;
    		    Outcome(w.betsFor[i].clientAddr, moneyToDistribute, wagerEventId, true);
	    	}

	    	for(uint g = 0; g < w.numBetsAgainst; g++){
	    		Outcome(w.betsAgainst[g].clientAddr, w.betsAgainst[g].amount, wagerEventId, false);
	    	}

	 	} else {

	 		for(uint j = 0; j < w.numBetsAgainst; j++){
	    		moneyToDistribute = (w.betsAgainst[i].amount * totalMoneyPool) / w.moneyPoolAgainst;
	    		w.betsAgainst[j].clientAddr.transfer(moneyToDistribute);
	    		moneyPoolRemaining = moneyPoolRemaining - moneyToDistribute;
	    		Outcome(w.betsFor[i].clientAddr, moneyToDistribute, wagerEventId, true);
	    	}

	    	for(uint y = 0; y < w.numBetsAgainst; y++){
	    		Outcome(w.betsAgainst[y].clientAddr, w.betsAgainst[y].amount, wagerEventId, false);
	    	}
	 	}

	 	//send remaining ether to owner
	 	owner.transfer(moneyPoolRemaining);

	 	//invalidate contract
	 	w.moneyPoolFor = 0;
	 	w.moneyPoolAgainst = 0;
	 	w.numBetsFor = 0;
	 	w.numBetsAgainst = 0;

        return true;
    }
    
    function returnMoney(uint wagerEventId) public onlyOwner {
        require(wagers[wagerEventId].takingBets == false);
        WagerEvent storage w = wagers[wagerEventId]; 
        
        for(uint i = 0; i < w.numBetsFor; i++){
    		w.betsFor[i].clientAddr.transfer(w.betsFor[j].amount);
    	}
    	
        for(uint j = 0; j < w.numBetsAgainst; j++){
	        w.betsAgainst[j].clientAddr.transfer(w.betsAgainst[j].amount);
	    }
    }

    
    //All the getters 

    //make some for getting Bet data

	function getMoneyPoolFor(uint wagerEventId) public constant returns (uint theMoneyPool){
		return wagers[wagerEventId].moneyPoolFor;
	}

	function getMoneyPoolAgainst(uint wagerEventId) public constant returns (uint theMoneyPool){
		return wagers[wagerEventId].moneyPoolAgainst;
	}

	function getMatchId(uint wagerEventId) public constant returns (uint theMatchId){
		return wagers[wagerEventId].matchId;
	}

	function getNumBetsAgainst(uint wagerEventId) public constant returns(uint theNumBets){
		return wagers[wagerEventId].numBetsAgainst;
	}

	function getNumBetsFor(uint wagerEventId) public constant returns(uint theNumBets){
		return wagers[wagerEventId].numBetsFor;
	}

	function getTakingBets(uint wagerEventId) public constant returns(bool){
		return wagers[wagerEventId].takingBets;
	}

}




