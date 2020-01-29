import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';

import '../css/bank-account.css';

class BankAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountName: '',
      sortCode: 0,
      accountNumber: 0,
      submissionComplete: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSkip = this.handleSkip.bind(this);
  }

  handleSubmit(event) {
    console.log(this.state.username);
    fetch('http://localhost:9000/api/add-bank-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: this.props.username }),
    })
      .then(res => res.text())
      .then(res => console.log(res));
    this.setState({ submissionComplete: true });
  }

  handleSkip(event) {
    this.setState({ submissionComplete: true });
    //this.props.switchToBankAccount(false);
    //this.props.switchToRegistration(false);
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.id;
    const value = target.value;

    this.setState({
      [name]: value,
    });
  }

  render() {
    if (this.state.submissionComplete) {
      return (
        <Redirect
          to={{
            pathname: '/dashboard',
            state: { username: this.state.username },
          }}
        />
      );
    }
    return (
      <Form className="bank-account-form">
        <div className="right-row">
          <Button onClick={this.handleSkip}>Skip</Button>
        </div>
        <div className="form-header" id="bank-account-header">
          <h3>Just two more steps! Connect your campaign bank account.</h3>
        </div>
        <FormGroup>
          <Label for="accountName">Account Name</Label>
          <Input
            type="text"
            id="accountName"
            value={this.state.accountName}
            onChange={this.handleInputChange}
            placeholder="Account Name (e.g. TM for PM)"
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
                placeholder="Account Number (XXXXXXXX)"
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
                placeholder="Sort Code (XX-XX-XX)"
              />
            </FormGroup>
          </Col>
        </Row>

        <div className="center-row" id="submit">
          <Button id="submit" onClick={this.handleSubmit}>
            Submit
          </Button>
        </div>
      </Form>
    );
  }
}

export default BankAccount;
