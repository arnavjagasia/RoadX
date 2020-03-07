import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button, Row } from 'reactstrap';

import '../css/request-reset.css';

class RequestReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      policymaker: '',
      resetCodeSent: '',
      resetCode: '',
      email: '',
      username: '',
      password: '',
      enteredWrongEmail: false,
      submissionComplete: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.userExists = this.userExists.bind(this);
  }

  userExists(username, email) {
    fetch('http://localhost:9000/api/finduser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: this.state.username }),
    })
      .then(res => res.json())
      .then(policymaker =>
        this.setState({ policymaker }, () => {
          localStorage.setItem('policymaker', JSON.stringify(this.state.policymaker));
        }),
      );
    return email === this.state.policymaker.email;
  }

  sendEmail(code) {
    fetch('http://localhost:9000/api/sendemail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: this.state.email, code: code }),
    });
  }

  handleSubmit(event) {
    if (this.userExists(this.state.username, this.state.email)) {
      console.log('email existed!');
      var code = Math.floor(Math.random() * 100000000);
      this.props.switchResetCode(code);
      this.sendEmail(code);
      this.props.switchToRequestReset(false);
      this.props.switchToResetPassword(true);
    } else {
      console.log('email did not exist!');
      this.enteredWrongEmail = true;
    }
  }

  handleBack(event) {
    this.props.switchToRequestReset(false);
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
    return (
      <Form className="registration-form">
        <div className="right-row">
          <Button onClick={this.handleBack}>Back</Button>
        </div>

        <div className="form-header" id="registration-header">
          <h3>We Can Help With That!</h3>
        </div>
        <div className="form-text">
          <p>Please enter your information below.</p>
        </div>
        <Row form>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input
              type="text"
              id="username"
              value={this.state.username}
              onChange={this.handleInputChange}
              placeholder=""
            />
          </FormGroup>
        </Row>
        <Row form>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="text"
              id="email"
              value={this.state.email}
              onChange={this.handleInputChange}
              placeholder=""
            />
          </FormGroup>
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

export default RequestReset;
