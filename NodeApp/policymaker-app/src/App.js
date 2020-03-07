import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './css/app.css';
import Landing from './components/landing.js';
import About from './components/about.js';
import Dashboard from './components/dashboard.js';
import BankAccount from './components/bank-account.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
    };

    this.setUser = this.setUser.bind(this);
  }

  setUser(username) {
    this.setState({ username: username });
  }

  render() {
    return (
      <Router>
        <div>
          <Route path="/" exact render={props => <Landing {...props} setUser={this.setUser} />} />
          <Route path="/about/" component={About} />
          <Route path="/bank-account/" component={BankAccount} />
          <Route
            path="/dashboard/"
            render={props => (
              <Dashboard {...props} resetState={true} username={this.state.username} />
            )}
          />
        </div>
      </Router>
    );
  }
}

export default App;
