import React, { Component } from 'react';

import '../css/header.css';
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }
  render() {
    return <div className="header-container" />;
  }
}

export default Header;
