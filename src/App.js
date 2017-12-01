/*eslint-disable*/
import React, { Component } from 'react'
import WagerContractJSON from '../build/contracts/Wager.json'
import getWeb3 from './utils/getWeb3'
import axios from 'axios'
import Router from './Router'

import 'font-awesome/css/font-awesome.min.css';
import 'bulma/css/bulma.css';
import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      liveMatches: [], //for future dev, to grab real live events
      wagerInstance: null,
      currentMatches: [null], //for test event
      account: null
    };
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      });

      // Instantiate contract once web3 provided.
      this.instantiateContract();
    })
    .catch((e) => {
      console.log(e);
    });
  }

  componentDidMount() {

    axios.get('http://localhost:4040/live/')
    .then(res => {
      var tempList = res.data;
      this.setState({
        liveMatches : tempList
      });
    })
    .catch((e) => {
      console.log(e);
    });

    //get initial currentMatch info faster than through a websocket

    axios.get('http://localhost:4040/currentMatch/').then(res => {
      var temp = res.data;
      var tempMatches = this.state.currentMatches;
      tempMatches[0] = temp;
      this.setState({
        currentMatches : tempMatches
      });
      console.log(this.state.currentMatches[0]);
    }).catch((e) => {
      console.log(e);
    });


    //get socket, eventually, this should be for any live event, but for now defaults to test
    var socket = new WebSocket('ws://localhost:4040/test');

    socket.onopen = function(){
      socket.send('Hellooooo from the other side!');
    };

    socket.onmessage = (event) => {

      var temp = JSON.parse(event.data);
      var tempMatches = this.state.currentMatches;
      tempMatches[0] = temp;
      this.setState({
        currentMatches : tempMatches
      });
     // console.log(this.state.currentMatches[0]);
    };

  }

  instantiateContract() {

    const contract = require('truffle-contract');
    const WagerContract = contract(WagerContractJSON);
    WagerContract.setProvider(this.state.web3.currentProvider);

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      WagerContract.deployed().then((instance) => {
        this.setState({
          wagerInstance : instance,
          account : accounts[0]
        });
      })
      .then(() => {
        console.log(this.state.account);
      });
    });
  }

  handleBet = (redWins) => {

    console.log(redWins);
    
    this.state.web3.eth.getAccounts((error, accounts) => {

      this.setState({
        account: accounts[0]
      });

      this.state.wagerInstance.makeBet(this.state.currentMatches[0].wagerEventId, redWins, 
        {value: 1000000000000000000 ,from: this.state.account})
        .then(function(result){

          console.log('made bet');

          for (var i = 0; i < result.logs.length; i++) {
            var log = result.logs[i];

            if (log.event == 'MakeBet') {
              console.log(log);
              break;
            }
          }

        });
    });
  }


  render() {
    return (
      <div className="App">
      <Router currentMatch={this.state.currentMatches[0] !== null ? this.state.currentMatches[0]: ''} handleBetCallback={this.handleBet}/>
      </div>
    );
  }
}

export default App
