# Clairvoyance
Clairvoyance is intended to be an eSports betting platform built on Ethereum, but is more of an educational project geared towards writing smart contracts, working with Truffle, and interacting with the smart contract on the front and back-end. Of course, you typically don't bet on a game while it is ongoing, but I just wanted to get connect some feed from Pandascore for it to act as an oracle. 

#Features
These are the main functionalities of the app.
*Users can Bet Ether on an eSports game (test feed)
*Distributes Ether pool after game ends according to bets
*Video syncs with game feed and events

#Running Locally
In order to run a local version, make sure to create a file called pandaScoreKeys.js with the following code:


```
module.exports = {
	token: '' // your API token here
}
```

Also be sure to have Truffle.js and the MetaMask extension. When running locally, first boot up Truffle, then the server, and lastly the React app.

#Improvements
*Cleaning up the React code
*Adding functionality for tournaments and real games
*Optimizing Wager smart contract