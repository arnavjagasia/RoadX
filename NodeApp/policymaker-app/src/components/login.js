import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

import '../css/login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      passwordMatch: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleForgot = this.handleForgot.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleRequestReset = this.handleRequestReset.bind(this);
    // this.handleResetPassword = this.handleResetPassword.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
  }

  checkPassword(username) {
    console.log('Checking password');
    fetch('http://localhost:9000/api/finduser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username }),
    })
      .then(res => res.json())
      .then(policymaker => {
        if (policymaker.password === this.state.password) {
          this.setState({ passwordMatch: true });
        }
      });
  }

  handleSubmit(event) {
    this.checkPassword(this.state.username);
  }

  handleRegister(event) {
    this.props.switchToRegistration(true);
  }

  handleRequestReset(event) {
    this.props.switchToRequestReset(true);
  }

  handleForgot(event) {
    console.log('OOPS');
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.id;
    const value = target.value;

    this.setState({
      [name]: value,
    });
  }

  range(low, high) {
    var array = [];
    for (var i = 0; i <= high - low; i++) {
      array[i] = low + i;
    }
    return array;
  }

  renderDates() {
    const monthItems = this.range(1, 12).map(month => (
      <option key={month.toString()}>{month}</option>
    ));
    const dateItems = this.range(1, 31).map(month => (
      <option key={month.toString()}>{month}</option>
    ));
    const yearItems = this.range(1950, 2000).map(month => (
      <option key={month.toString()}>{month}</option>
    ));
    return { months: monthItems, dates: dateItems, years: yearItems };
  }

  render() {
    if (this.state.passwordMatch === true) {
      console.log(this.state.username);
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
      <Form className="registration-form" id="login-form">
        <div className="form-header">
          <h3>Let's Get Started.</h3>
        </div>
        <div className="center-row">
          <p>
            {' '}
            Don't Have an Account?
            <Button onClick={this.handleRegister}>Create one here.</Button>
          </p>
        </div>
        <div className="center-row">
          <p>
            {' '}
            Forgot your Password?
            <Button onClick={this.handleRequestReset}>Reset it here.</Button>
          </p>
        </div>
        <FormGroup>
          <Label for="username">Username</Label>
          <Input
            type="text"
            id="username"
            value={this.state.username}
            onChange={this.handleInputChange}
            placeholder="Username"
          />
        </FormGroup>

        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="Password"
            onChange={this.handleInputChange}
          />
        </FormGroup>

        <div className="login-buttons">
          <div className="center-row">
            <Button onClick={this.handleSubmit}>Submit</Button>
          </div>
        </div>
      </Form>
    );
  }
}

export default Login;
