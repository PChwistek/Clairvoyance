/* eslint-disable*/
import React from 'react'
import ReactDOM from 'react-dom'
import YouTube from 'react-youtube';

class BettingDetail extends React.Component{

  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // This binding is necessary to make `this` work in the callback
  }


  render(){
    return(
      <section className="container">
        <div className="sandbox">
          <div className="tile is-ancestor">
            <div className="tile is-parent is-3">
              <article className="tile is-child notification is-white">
                <p className="title has-text-centered"><span className="icon"><i className="fa fa-gamepad team-red"></i></span></p>
            <p className="subtitle has-text-centered" id="team-red">{this.props.currentMatch.redTeamName}</p>
            <div className="content has-text-centered">
              <p> {typeof this.props.currentMatch.bluePlayers !== 'undefined'? this.props.currentMatch.redPlayers[0]: ''} </p>
            <p> {typeof this.props.currentMatch.bluePlayers !== 'undefined'? this.props.currentMatch.redPlayers[1]: ''} </p>
            <p> {typeof this.props.currentMatch.bluePlayers !== 'undefined'? this.props.currentMatch.redPlayers[2]: ''} </p>
            <p> {typeof this.props.currentMatch.bluePlayers !== 'undefined'? this.props.currentMatch.redPlayers[3]: ''} </p>
            <p> {typeof this.props.currentMatch.bluePlayers !== 'undefined'? this.props.currentMatch.redPlayers[4]: ''} </p>
            <br></br>
            <a className="button" onClick={() => this.props.handleBetCallback(true)}>Bet on Red</a>
            </div>
            <br></br>
            </article>
          </div>
            <div className="tile is-parent is-3">
          <article className="tile is-child notification is-white">
            <p className="title has-text-centered"><span className="icon"><i className="fa fa-gamepad team-blue"></i></span></p>
            <p className="subtitle has-text-centered" id="team-blue">{this.props.currentMatch.blueTeamName}</p>
          <div className="content has-text-centered">
            <p> {typeof this.props.currentMatch.bluePlayers !== 'undefined'? this.props.currentMatch.bluePlayers[0]: ''} </p>
            <p> {typeof this.props.currentMatch.bluePlayers !== 'undefined'? this.props.currentMatch.bluePlayers[1]: ''} </p>
            <p> {typeof this.props.currentMatch.bluePlayers !== 'undefined'? this.props.currentMatch.bluePlayers[2]: ''} </p>
            <p> {typeof this.props.currentMatch.bluePlayers !== 'undefined'? this.props.currentMatch.bluePlayers[3]: ''} </p>
            <p> {typeof this.props.currentMatch.bluePlayers !== 'undefined'? this.props.currentMatch.bluePlayers[4]: ''} </p>
            <br></br>
            <a className="button" onClick={() => this.props.handleBetCallback(false)}>Bet on Blue</a>
            </div>
          <br></br>
           </article>
         </div>
         <Video time={this.props.currentMatch.timestamp}/>
          </div>
        </div>
        </section>
    );
  }
}



const Video = ({time}) => (
  <div className="tile is-parent">
  <article className="tile is-child has-text-centered">
    <div className="content">
      <Game time ={time}/>
    </div>
  </article>
  </div>
);

class Game extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      time: 0,
      render : false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    
    return typeof this.props.time === 'undefined';
  }

  render() {

    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        loop: 1,
        start: this.props.time
      }
    };
  
    return (<YouTube videoId="61NdhI5TzOM" opts={opts} onReady={this._onReady}/>);

  }
 
  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.mute();
  }
}

ReactDOM.render(<Game />, document.getElementById('root'));
ReactDOM.render(<Video />, document.getElementById('root'));

export default BettingDetail