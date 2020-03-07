import React, { Component } from 'react';

import '../css/table.css';
class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }
  render() {
    return <div className="table-container" />;
  }
}

export default Table;
