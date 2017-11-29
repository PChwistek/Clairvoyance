import React from 'react'
import ReactDOM from 'react-dom'

import {
  BrowserRouter,
  Route,
  Link
} from 'react-router-dom'

var text = " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

import BettingDetail from './BettingDetail'

const routes = [
  
  { path: '/',
    mainText: () => <div><h1 className="title">An eSports Betting Platform</h1><h2 className="subtitle">{text}</h2></div>,
    exact: true,
    main: () => Home,
  },
  {
    path: '/tournaments',
    mainText: () => <div><h1 className="title">Bet on Pro Games</h1><h2 className="subtitle"> *Not implemented</h2></div>,
    main: () => Tournaments,
  }
]

const Router = ({currentMatch, handleBetCallback}) => (
  <BrowserRouter>
    <div>
      <section className="hero is-info is-medium is-bold">
        <div className="hero-head">
          <nav className="navbar">
            <div className="container">
              <div className="navbar-brand">
                <div className="navbar-item">
                  <Link to="/"><img src={require("./logo3.png")}></img></Link>
                </div>
              </div>
              <div id="navbarMenu" className="navbar-menu">
                <div className="navbar-end">
                  <div className="navbar-item">
                    <Link to="/tournaments" className="nav-item"> <span className="nav-item"> Pro Games </span> </Link>
                  </div>
                  <div className="navbar-item">
                    <Link to="https://github.com/PChwistek/Clairvoyance" target="_blank">
                      <div className="button is-white is-outlined is-small">
                        <span className="icon">
                          <i className="fa fa-github"></i>
                        </span>
                        <span> View Source </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
        <div className="hero-body">
        <div className="container has-text-centered">
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.mainText}
            />
          ))}
      </div>
      </div>
      </section>

      <Route exact path="/" render={()=><Home currentMatch={currentMatch} handleBetCallback={handleBetCallback}/>}/>
      <Route path="/tournaments" component={Tournaments}/>
      <Footer />

    </div>
  </BrowserRouter>
)

const Home = ({currentMatch, handleBetCallback}) => (
  <div>
    <Card />
    <Divider />
    <BettingDetail currentMatch={currentMatch} handleBetCallback={handleBetCallback} />
  </div>
)

const Tournaments = ({ match }) => (
  <div>
  </div>
)

const Tournament = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
)

const Card = () => (
  <div className="box cta">
    <p className="has-text-centered">
      <span className="tag is-primary">New</span> Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </p>
  </div>
)

const Divider = () => (
  <div className="intro column is-8 is-offset-2">
        <h2 className="title">Please open your MetaMask extension and try betting on the game below!</h2><br></br>
        <p className="subtitle">Ideally, you would want to bet before a game starts, but since that API is 250 dollars a month, we are just using a test endpoint and its respective game feed.</p>
  </div>
)

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="content has-text-centered">
        <p> CSS is based on a template by <a href="https://github.com/dansup" target="_blank">Daniel Supernault</a></p>
      </div>
    </div>
  </footer>
)

ReactDOM.render(<Divider />, document.getElementById('root'))
ReactDOM.render(<Card />, document.getElementById('root'))
ReactDOM.render(<Footer />, document.getElementById('root'))

export default Router