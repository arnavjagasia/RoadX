import React, { Component } from 'react';
import { Table } from 'reactstrap';

import '../../css/dashboard.css';
import '../../css/header.css';
import '../../css/table.css';

class TransactionsListPanel extends Component {
  render() {
    if (this.props.transactions) {
      var tablerows = this.props.transactions.map((transactions, i) => {
        return (
          <tr>
            <th scope="row">{i + 1}</th>
            <td>{transactions.month + '/' + transactions.day + '/' + transactions.year}</td>
            <td>@{transactions.patronUsername}</td>
            <td>{transactions.amount}</td>
            <td>{transactions.behavior}</td>
          </tr>
        );
      });
    }

    return (
      <div className="dashboard-panel-container">
        <h1>Your Transaction History</h1>
        <h3>See all your transactions below.</h3>

        <div className="dashboard-transaction-table">
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>From</th>
                <th>Amount</th>
                <th>Behavior</th>
              </tr>
            </thead>
            <tbody>{tablerows}</tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default TransactionsListPanel;
