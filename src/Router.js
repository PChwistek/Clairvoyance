import React from 'react'
import {
  BrowserRouter,
  Route,
  Link
} from 'react-router-dom'

const Router = () => (
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
                    <Link to="/topics" className="nav-item"> <span className="nav-item"> Wagers </span> </Link>
                  </div>
                  <div className="navbar-item">
                    <Link to="/about" > <span className="nav-item"> About </span></Link>
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
      </section>

      <hr/>

      <Route exact path="/" component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="/topics" component={Topics}/>
    </div>
  </BrowserRouter>
)

const Navbar = () => (
  <section className="hero is-info is-medium is-bold">
    <div className="hero-head">
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <Link to="/"><Image source='./logo.png'/></Link>
          </div>
        </div>
      </nav>
    </div>
  </section>
)

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>
          Rendering with React
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>
          Components
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>
          Props v. State
        </Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic}/>
    <Route exact path={match.url} render={() => (
      <h3>Please select a topic.</h3>
    )}/>
  </div>
)

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
)

export default Router