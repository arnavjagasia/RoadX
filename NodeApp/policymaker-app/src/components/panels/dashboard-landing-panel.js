import React, { Component } from 'react';

import '../../css/dashboard.css';
import '../../css/header.css';
import '../../css/table.css';

class DashboardLandingPanel extends Component {
  render() {
    var total = 0;
    if (this.props.transactions) {
      this.props.transactions.forEach(t => {
        total += t.amount;
      });
    }

    var warningVisibility = "block";
    console.log(this.props.policymaker.bankAccount);
    if ((this.props.policymaker.bankAccount) && (this.props.policymaker.chosenTopics) && (this.props.policymaker.chosenTopics.length > 0)) {
      warningVisibility = "none";
    }

    return (
      <div className="dashboard-panel-container" id="welcome-panel">
        <h1>Hello, {this.props.policymaker.firstName}</h1>
        <h3>Manage and track your users and donations here.</h3>
        <h3 style={{color:"RED", display:warningVisibility}}>You will not be able to receive donations until you go to Settings to link a bank account and choose the causes you support.</h3>
        <div className="dashboard-landing-donations">
          <h2> Your Total Donations:</h2>
          <h1>${total.toFixed(2)}</h1>
        </div>
      </div>
    );
  }
}

export default DashboardLandingPanel;
