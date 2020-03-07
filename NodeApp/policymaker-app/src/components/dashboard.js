import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';

import DashboardMenu from './dashboard-menu.js';
import DashboardLandingPanel from './panels/dashboard-landing-panel.js';
import WeeklyTotalPanel from './panels/weekly-total-panel.js';
import TransactionsListPanel from './panels/transactions-list-panel.js';
import DisplayBehaviorPanel from './panels/display-behavior-panel.js';
import VotingRecordsPanel from './panels/voting-records-panel.js';
import SettingsPanel from './panels/settings-panel.js';

import '../css/dashboard.css';
import '../css/header.css';
import '../css/table.css';
import BulletinBoardPanel from './panels/bulletin-board-panel.js';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayWeeklyTotals: false,
      displayTransactionList: false,
      displayBehaviorList: false,
      displayVotingRecords: this.props.displayVotingRecords || false,
      displaySettings: this.props.displaySettings || false,
      displayBulletinBoard: this.props.displayBulletinBoard || false,
      policymaker: JSON.parse(localStorage.getItem('policymaker')) || '',
      transactions: JSON.parse(localStorage.getItem('transactions')) || '',
      topics: JSON.parse(localStorage.getItem('topics')) || '',
      allRecords: JSON.parse(localStorage.getItem('allRecords')) || '',
      relevantRecords: JSON.parse(localStorage.getItem('relevantRecords')) || '',
      messages: JSON.parse(localStorage.getItem('messages')) || '',
      policyMakerMessages: JSON.parse(localStorage.getItem('policyMakerMessages')) || '',
    };

    this.getUser = this.getUser.bind(this);
    this.getAllVotingRecords = this.getAllVotingRecords.bind(this);
    this.getRelevantVotingRecords = this.getRelevantVotingRecords.bind(this);
    this.getTopics = this.getTopics.bind(this);
    this.getTransactions = this.getTransactions.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.getPolicyMakerMessages = this.getPolicyMakerMessages.bind(this);
    this.displayPanel = this.displayPanel.bind(this);
    this.renderPanel = this.renderPanel.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  displayPanel(panelName) {
    this.setState({
      displayWeeklyTotals: false,
      displayTransactionList: false,
      displayBehaviorList: false,
      displayVotingRecords: false,
      displaySettings: false,
      displayBulletinBoard: false,
    });
    this.setState({ [panelName]: true });
  }

  renderPanel() {
    if (this.state.displayWeeklyTotals) {
      return (
        <WeeklyTotalPanel
          policymaker={this.state.policymaker}
          transactions={this.state.transactions}
        />
      );
    } else if (this.state.displayTransactionList) {
      return (
        <TransactionsListPanel
          policymaker={this.state.policymaker}
          transactions={this.state.transactions}
          records={this.state.relevantRecords}
        />
      );
    } else if (this.state.displayBehaviorList) {
      return (
        <DisplayBehaviorPanel
          policymaker={this.state.policymaker}
          transactions={this.state.transactions}
          records={this.state.relevantRecords}
        />
      );
    } else if (this.state.displayVotingRecords) {
      return (
        <VotingRecordsPanel
          policymaker={this.state.policymaker}
          transactions={this.state.transactions}
          records={this.state.relevantRecords}
        />
      );
    } else if (this.state.displaySettings) {
      return (
        <SettingsPanel
          policymaker={this.state.policymaker}
          transactions={this.state.transactions}
          topics={this.state.topics}
        />
      );
    } else if (this.state.displayBulletinBoard) {
      return (
        <BulletinBoardPanel
          policymaker={this.state.policymaker}
          transactions={this.state.transactions}
          topics={this.state.topics}
          messages={this.state.policyMakerMessages}
        />
      );
    } else {
      return (
        <DashboardLandingPanel
          policymaker={this.state.policymaker}
          transactions={this.state.transactions}
          records={this.state.relevantRecords}
        />
      );
    }
  }

  getUser() {
    var username = !this.props.location.state
      ? this.props.username
      : this.props.location.state.username;

    // var localState = JSON.parse(localStorage.getItem('policymaker'));
    // var shouldGetUsername =
    //   !localState || (localState && username && username != localState.username);

    // if (shouldGetUsername) {
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
    // }
    console.log(this.state.policymaker);
  }

  getTransactions() {
    var username = !this.props.location.state
      ? this.props.username
      : this.props.location.state.username;
    // var localState = JSON.parse(localStorage.getItem('policymaker'));
    // var shouldGetUsername =
    //   !localState || (localState && username && username != localState.username);
    // if (shouldGetUsername) {
    fetch('http://localhost:9000/api/getTransactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username }),
    })
      .then(res => res.json())
      .then(transactions =>
        this.setState({ transactions }, () => {
          localStorage.setItem('transactions', JSON.stringify(this.state.transactions));
          console.log(transactions);
        }),
      );
    //}
  }

  //Get voting records
  getAllVotingRecords() {
    var username = !this.props.location.state
      ? this.props.username
      : this.props.location.state.username;

    //var topics = !this.props.location.state.chosenTopics ? this.props.chosenTopics : this.props.location.state.chosenTopics;
    //var shouldGetUsername =  username && (username != JSON.parse(localStorage.getItem('policymaker')).username)
    fetch('http://localhost:9000/api/findvotingrecords', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username }),
    })
      .then(res => res.json())
      .then(allRecords =>
        this.setState({ allRecords }, () => {
          localStorage.setItem('allRecords', JSON.stringify(this.state.allRecords));
          console.log(allRecords);
          this.getTopics();
        }),
      );
  }

  //Get voting records for policymaker's chosen topics
  getRelevantVotingRecords() {
    var topics = this.state.policymaker.chosenTopics;
    var relevantRecords = [];
    this.state.allRecords.forEach(record => {
      if (topics.includes(record.topic)) {
        relevantRecords.push(record);
      }
    });
    console.log(relevantRecords);
    this.setState({ relevantRecords }, () => {
      localStorage.setItem('relevantRecords', JSON.stringify(this.state.relevantRecords));
    });
  }

  //Get policymaker's posts to patrons
  getMessages() {
    fetch('http://localhost:9000/api/getmessages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(messages =>
        this.setState({ messages }, () => {
          localStorage.setItem('messages', JSON.stringify(this.state.messages));
          console.log(messages);
          this.getPolicyMakerMessages();
        }),
      );
  }

  getPolicyMakerMessages() {
    var username = !this.props.location.state
      ? this.props.username
      : this.props.location.state.username;

    var policyMakerMessages = [];
    this.state.messages.forEach(message => {
      if (message.username === username) {
        policyMakerMessages.push(message);
      }
    });
    console.log(policyMakerMessages);
    this.setState({ policyMakerMessages }, () => {
      localStorage.setItem('policyMakerMessages', JSON.stringify(this.state.policyMakerMessages));
    });
  }

  getTopics() {
    var username = !this.props.location.state
      ? this.props.username
      : this.props.location.state.username;

    fetch('http://localhost:9000/api/gettopics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username }),
    })
      .then(res => res.json())
      .then(topics =>
        this.setState({ topics }, () => {
          localStorage.setItem('topics', JSON.stringify(this.state.topics));
          console.log(topics);
          this.getRelevantVotingRecords();
        }),
      );
  }

  componentDidMount() {
    this.getUser();
    this.getTransactions();
    this.getAllVotingRecords();
    this.getMessages();
  }

  render() {
    return (
      <div className="dashboard-container">
        <Row>
          <Col md={2}>
            <DashboardMenu policymaker={this.state.policymaker} displayPanel={this.displayPanel} />
          </Col>
          <Col md={10}>{this.renderPanel()}</Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
