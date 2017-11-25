import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
import axios from 'axios';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      currentMatches: [{id: 'test', isOngoing: true , game: 'league-of-legends', gameData: {}}]
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  componentDidMount() {
    axios.get(`http://localhost:3000/live/`)
      .then(res => {
        var tempList = res.data;
        var temp = {};
        for (var i = tempList.length - 1; i >= 0; i--) {
          temp = {
            id: tempList[i].endpoints[0].match_id,
            isOngoing: true,
            game: tempList[i].event.game,
            gameData: {}
          };
          this.state.currentMatches.push(temp);
        };
        console.log(this.state.currentMatches);
    }).catch(() => {
      console.log('Error connecting to REST part of server');
    });

    //get socket, eventually, this should be for any live event
    var socket = new WebSocket('ws://localhost:3000/' + this.state.currentMatches[0].id)
    socket.onopen = function(){
      socket.send("Hellooooo from the other side!")
    }
    socket.onmessage = (event: Event) => {

      var temp = JSON.parse(event.data);
      var tempMatches = this.state.currentMatches;

      try{
        tempMatches[0].isOngoing = !temp.game.finished; //just for ease of access
        tempMatches[0].gameData = temp;
      } catch(error){
      //  console.log(error);
      }

      this.setState({
        currentMatches : tempMatches
      })

      console.log(this.state.currentMatches[0]);

    }
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance

        // Stores a given value, 5 by default.
        return simpleStorageInstance.set(5, {from: accounts[0]})
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] })
      })
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <p>Your Truffle Box is installed and ready.</p>
              <h2>Smart Contract Example</h2>
              <p>If your contracts compiled and migrated successfully, below will show a stored value of 5 (by default).</p>
              <p>Try changing the value stored on <strong>line 59</strong> of App.js.</p>
              <p>The stored value is: {this.state.storageValue}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
