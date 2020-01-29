import React, { Component } from 'react';
import { Form, FormGroup, FormText, Label, Input, Button, Row, Col, Table } from 'reactstrap';
import { Link } from 'react-router-dom';

import '../../css/bank-account.css';
import '../../css/update-info.css';
import '../../css/delete-account.css';

import '../../css/dashboard.css';
import '../../css/header.css';
import '../../css/table.css';

class SettingsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.policymaker.username,
      usernameEntered: '',
      email: this.props.policymaker.email,
      blurb: this.props.policymaker.blurb,
      affiliation: this.props.policymaker.affiliation,
      accountName: 'Account Name (e.g. TM for PM)',
      sortCode: '8-Digit Account Number (XXXXXXXX)',
      accountNumber: '6-Digit Sort Code (XXXXXX)',
      submissionComplete: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
    this.handleSaveAccount = this.handleSaveAccount.bind(this);
    this.handleSaveTopics = this.handleSaveTopics.bind(this);
    this.handleSaveUpdates = this.handleSaveUpdates.bind(this);
    this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
  }

  handleSaveAccount(event) {
    var json = this.state;
    console.log(json);
    fetch('http://localhost:9000/api/add-bank-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json),
    })
      .then(res => res.text())
      .then(res => console.log(res))
      .then(res => window.location.reload());
    this.setState({ submissionComplete: true });
  }

  handleSaveTopics(event) {
    var chosenTopics = [];
    var topics = document.getElementsByName('topic');

    topics.forEach(topic => {
      if (topic.options[topic.selectedIndex].text === 'Yes') {
        chosenTopics.push(topic.value);
      }
    });
    console.log(chosenTopics);
    var info = {
      username: this.state.username,
      topics: chosenTopics,
    };

    fetch('http://localhost:9000/api/updatetopics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info),
    })
      .then(res => res.text())
      .then(res => console.log(res));
      // .then(res => window.location.reload());
  }

  handleSaveUpdates(event) {
    console.log(this.state.email);
    console.log(this.state.affiliation);
    console.log(this.state.blurb);
    var info = {
      username: this.state.username,
      email: this.state.email,
      affiliation: this.state.affiliation,
      blurb: this.state.blurb,
    };

    fetch('http://localhost:9000/api/updateinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info),
    }).then(res => window.location.reload());
  }

  handleDeleteAccount(event) {
    console.log(this.state.username);
    console.log(this.state.usernameEntered);
    var info = {
      username: this.state.username,
      email: this.state.email,
      affiliation: this.state.affiliation,
      blurb: this.state.blurb,
    };

    if (this.state.usernameEntered === this.state.username) {
      fetch('http://localhost:9000/api/deleteaccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(info),
      });
    }
  }

  handleCheckboxClick(id) {
    var checkbox = document.getElementById(id);
    checkbox.checked = !checkbox.checked;
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.id;
    const value = target.value;

    this.setState({
      [name]: value,
    });
  }

  handleChange(event) {
    const target = event.target;
    const id = target.id;
    if (document.getElementById(id).checked) {
      document.getElementById(id).checked = null;
    }
  }

  componentDidMount() {
    if (this.props.policymaker.bankAccount) {
      this.setState({
        accountName: this.props.policymaker.bankAccount.accountName,
        sortCode: this.props.policymaker.bankAccount.sortCode,
        accountNumber: this.props.policymaker.bankAccount.accountNumber,
      });
    }
  }

  render() {
    console.log(this.props.topics);
    if (this.props.topics) {
      var tablerows = this.props.topics.map((topic, i) => {
        if (this.props.policymaker.chosenTopics.includes(topic.title)) {
          return (
            <tr>
              <td>
                <select name={'topic'}>
                  <option value={topic.title} selected>
                    Yes
                  </option>
                  <option value={topic.title}>No</option>
                </select>
              </td>
              <td>{topic.title}</td>
              <td>{topic.subtitle}</td>
              <td>{topic.description}</td>
            </tr>
          );
        } else {
          return (
            <tr>
              <td>
                <select name={'topic'}>
                  <option value={topic.title}>Yes</option>
                  <option value={topic.title} selected>
                    No
                  </option>
                </select>
              </td>
              <td>{topic.title}</td>
              <td>{topic.subtitle}</td>
              <td>{topic.description}</td>
            </tr>
          );
        }
      });
    }
    return (
      <div className="dashboard-panel-container">
        <h1>Settings</h1>
        <h3>Connect your bank account and choose the causes you support.</h3>

        <div className="form-header" id="bank-account-header">
          <h4>Connect your bank account.</h4>
        </div>
        <Form className="bank-account-form">
          <FormGroup>
            <Label for="accountName">Account Name</Label>
            <Input
              type="text"
              id="accountName"
              value={this.state.accountName}
              onChange={this.handleInputChange}
              placeholder={this.state.accountName}
            />
          </FormGroup>

          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label for="accountNumber">Account Number</Label>
                <Input
                  type="number"
                  id="accountNumber"
                  value={this.state.accountNumber}
                  onChange={this.handleInputChange}
                  placeholder={this.state.accountNumber}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="sortCode">Sort Code</Label>
                <Input
                  type="number"
                  id="sortCode"
                  value={this.state.sortCode}
                  onChange={this.handleInputChange}
                  placeholder={this.state.sortCode}
                />
              </FormGroup>
            </Col>
          </Row>

          <div className="center-row" id="submit">
            <Button id="saveAccount" onClick={this.handleSaveAccount}>
              Save
            </Button>
          </div>
        </Form>

        <div className="form-header" id="bank-account-header">
          <h4>Choose your causes.</h4>
        </div>
        <Table>
          <thead>
            <tr>
              <th>Support?</th>
              <th>Title</th>
              <th>Subtitle</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>{tablerows}</tbody>
        </Table>

        <div className="center-row" id="submit">
          <Button id="saveTopics" onClick={this.handleSaveTopics}>
            Save
          </Button>
        </div>

        <div className="form-header" id="update-info-header">
          <h4>Update your information.</h4>
        </div>
        <Form className="update-info-form">
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label for="email" name={'email'}>
                  Email Address
                </Label>
                <Input
                  type="text"
                  id="email"
                  value={this.state.email}
                  onChange={this.handleInputChange}
                  placeholder={this.state.email}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="affiliation">Affiliation</Label>
                <Input
                  type="select"
                  id="affiliation"
                  value={this.state.affiliation}
                  onChange={this.handleInputChange}
                  placeholder={this.state.affiliation}
                >
                  <option />
                  <option>Other</option>
                  <option>Democrat</option>
                  <option>Republican</option>
                  <option>Independent</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <FormGroup>
            <Label for="blurb">Personal Bio</Label>
            <FormText color="muted">Tell us, and your followers, a little bit about you!</FormText>
            <Input
              type="textarea"
              id="blurb"
              value={this.state.blurb}
              onChange={this.handleInputChange}
              placeholder={this.state.blurb}
            />
          </FormGroup>

          <div className="center-row" id="submit">
            <Button id="saveUpdates" onClick={this.handleSaveUpdates}>
              Save
            </Button>
          </div>
        </Form>

        <div className="form-header" id="delete-account-header">
          <h4>Delete your account.</h4>
        </div>
        <Form className="delete-account-form">
          <Row form>
            <Col md={9}>
              <FormGroup>
                <Label for="username" name={'username'}>
                  Enter Your Username to Delete your Account
                </Label>
                <Input
                  type="text"
                  id="usernameEntered"
                  value={this.state.usernameEntered}
                  onChange={this.handleInputChange}
                  placeholder={''}
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <div className="center-row" id="submit-delete">
                <Button id="delete" onClick={this.handleDeleteAccount}>
                  <Link to="/" id="delete-link">
                    Delete Account
                  </Link>
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default SettingsPanel;
