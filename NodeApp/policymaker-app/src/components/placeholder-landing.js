import React, { Component } from 'react';
import '../css/landing.css';

class PlaceHolderLanding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      policymaker: JSON.parse(localStorage.getItem('policymaker')) || ''
    };

    this.getUser = this.getUser.bind(this);
  }

  getUser() {

    var username = !this.props.location.state ? this.props.username : this.props.location.state.username
    var localState = JSON.parse(localStorage.getItem('policymaker'));
    var shouldGetUsername =  !localState || (localState && username && (username != localState.username));

    if (shouldGetUsername) {
      fetch('http://localhost:9000/api/finduser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username }),
      })
        .then(res => res.json())
        .then(policymaker =>
          this.setState({ policymaker }, () => {
            localStorage.setItem('policymaker', JSON.stringify(this.state.policymaker));
          }),
        );
    }
  }

  componentDidMount() {
    this.getUser();
  }

  render() {
    return (
      <div className="welcome-title">
        <h1>Hello {this.state.policymaker.firstName}</h1>
        <h3>Ready to Make Change?</h3>
      </div>
    );
  }
}

export default PlaceHolderLanding;
