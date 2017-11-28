import React from 'react'
import ReactDOM from 'react-dom'
import YouTube from 'react-youtube';

const BettingDetail = () => (
<section className="container">
    <div className="sandbox">
      <div className="tile is-ancestor">
	   	<TeamRed />
	   	<TeamBlue />
	   	<Video />
      </div>
    </div>
 </section>
)

const TeamRed = () => (

  <div className="tile is-parent is-3">
	<article className="tile is-child notification is-white">
	  <p className="title has-text-centered"><span className="icon"><i className="fa fa-gamepad team-red"></i></span></p>
	  <p className="subtitle has-text-centered" id="team-red">Team Red</p>
	  <div className="content has-text-centered">
	  	  <a className="button">Bet</a>
	  </div>
	  <br></br>
	</article>
  </div>

)

const TeamBlue = () => (

  <div className="tile is-parent is-3">
	<article className="tile is-child notification is-white">
	  <p className="title has-text-centered"><span className="icon"><i className="fa fa-gamepad team-blue"></i></span></p>
	  <p className="subtitle has-text-centered" id="team-blue">Team Blue</p>
	  <div className="content has-text-centered">
	  	  <a className="button">Bet</a>
	  </div>
	  <br></br>
	</article>
  </div>
)

const Video = () => (

  <div className="tile is-parent">
	<article className="tile is-child has-text-centered">
	  <div className="content">
	  	<Game />
	  </div>
	</article>
  </div>
)

class Game extends React.Component {
  render() {
    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };
 
    return (<YouTube videoId="61NdhI5TzOM" opts={opts} onReady={this._onReady}/>);

  }
 
  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.mute();
  }
}

ReactDOM.render(<Game />, document.getElementById('root'))
ReactDOM.render(<TeamRed />, document.getElementById('root'))
ReactDOM.render(<TeamBlue />, document.getElementById('root'))
ReactDOM.render(<Video />, document.getElementById('root'))


export default BettingDetail