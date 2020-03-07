import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Button, Row } from 'reactstrap';

import '../css/reset-password.css';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resetCodeSent: this.props.resetCode,
      resetCode: '',
      email: '',
      username: '',
      password: '',
      enteredWrongCode: false,
      submissionComplete: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  handleSubmit(event) {
    if (this.state.resetCode - this.state.resetCodeSent === 0) {
      console.log('entered correct reset code!');
      console.log(this.state.password);
      var info = {
        username: this.state.username,
        password: this.state.password,
      };

      fetch('http://localhost:9000/api/resetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(info),
      })
        .then(res => res.text())
        .then(res => window.location.reload());
      this.setState({ submissionComplete: true });
    } else {
      console.log('entered incorrect reset code!');
      console.log(this.state.resetCode);
      console.log(this.state.resetCodeSent);
      this.enteredWrongCode = true;
    }
  }

  handleBack(event) {
    this.props.switchToResetPassword(false);
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
      <Form className="registration-form">
        <div className="right-row">
          <Button onClick={this.handleBack}>Back</Button>
        </div>

        <div className="form-header" id="registration-header">
          <h3>Check your Inbox!</h3>
        </div>
        <div className="form-text">
          <p>We emailed you a reset code.</p>
        </div>
        <Row form>
          <FormGroup>
            <Label for="resetCode">Reset Code</Label>
            <Input
              type="text"
              id="resetCode"
              value={this.state.resetCode}
              onChange={this.handleInputChange}
              placeholder="12345678"
            />
          </FormGroup>
        </Row>
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
            <Label for="password">New Password</Label>
            <Input
              type="text"
              id="password"
              value={this.state.password}
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

export default ResetPassword;
