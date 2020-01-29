import React, { Component } from 'react';
import '../css/landing.css';
import { Button } from 'reactstrap';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
    this.handleAbout = this.handleAbout.bind(this);
  }

  handleAbout(event) {
    this.props.switchToAbout(true);
  }

  render() {
    return (
      <div className="welcome-title">
        <h1>Welcome to PolicyMaker</h1>
        <h3>Ready to Make Change?</h3>
        <div className="center-row" id="learn-more">
          <Button className="about-button" onClick={this.handleAbout}>
            Learn More
          </Button>
        </div>
      </div>
    );
  }
}

export default Welcome;
