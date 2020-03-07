import React, { Component } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import { Link } from 'react-router-dom';

import '../css/dashboard.css';
import '../css/header.css';
import '../css/table.css';

class DashboardMenu extends Component {
  constructor(props) {
    super(props);
    this.displayPanel = this.displayPanel.bind(this);
  }

  displayPanel(event) {
    console.log(event.target.id);
    this.props.displayPanel(event.target.id);
  }

  render() {
    return (
      <div className="dashboard-menu-container">
        <ButtonGroup vertical={true}>
          <Button id="displayWelcomePanel" onClick={this.displayPanel}>
            Welcome
          </Button>

          <Button id="displayWeeklyTotals" onClick={this.displayPanel}>
            Weekly Donations
          </Button>

          <Button id="displayBulletinBoard" onClick={this.displayPanel}>
            Bulletin Board
          </Button>

          <Button id="displayTransactionList" onClick={this.displayPanel}>
            All Transactions
          </Button>

          <Button id="displayBehaviorList" onClick={this.displayPanel}>
            Matched Behaviors
          </Button>

          <Button id="displayVotingRecords" onClick={this.displayPanel}>
            Your Voting Record
          </Button>

          <Button id="displaySettings" onClick={this.displayPanel}>
            Settings
          </Button>

          <Button>
            <Link to="/">Logout</Link>
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}

export default DashboardMenu;
