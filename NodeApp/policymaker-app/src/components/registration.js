import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Button, FormText, Row, Col } from 'reactstrap';

import '../css/registration.css';

class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      selectMonth: '',
      selectDate: '',
      selectYear: '',
      email: '',
      phone: '',
      blurb: '',
      affiliation: '',
      username: '',
      password: '',
      submissionComplete: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  handleSubmit(event) {
    this.props.setUser(this.state.username);
    var json = this.state;
    console.log(json);
    fetch('http://localhost:9000/api/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json),
    })
      .then(res => res.text())
      .then(res => console.log(res));
    this.setState({ submissionComplete: true });
    //this.props.switchToRegistration(false);
    //this.props.switchToBankAccount(true);
  }

  handleBack(event) {
    this.props.switchToRegistration(false);
    //this.props.switchToBankAccount(false);
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
          <h3>Welcome Aboard!</h3>
        </div>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label for="firstName">First Name</Label>
              <Input
                type="text"
                id="firstName"
                value={this.state.firstName}
                onChange={this.handleInputChange}
                placeholder="First Name (e.g. Theresa)"
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="lastName">Last Name</Label>
              <Input
                type="text"
                id="lastName"
                value={this.state.lastName}
                onChange={this.handleInputChange}
                placeholder="Last Name (e.g. May)"
              />
            </FormGroup>
          </Col>
        </Row>

        <Row form>
          <Col md={3}>
            <Label for="selectMonth">Birth Month</Label>
            <Input type="select" id="selectMonth" onChange={this.handleInputChange}>
              <option />
              {this.renderDates().months}
            </Input>
          </Col>
          <Col md={3}>
            <Label for="selectDate">Birth Date</Label>
            <Input type="select" id="selectDate" onChange={this.handleInputChange}>
              <option />
              {this.renderDates().dates}
            </Input>
          </Col>
          <Col md={3}>
            <Label for="selectYear">Birth Year</Label>
            <Input type="select" id="selectYear" onChange={this.handleInputChange}>
              <option />
              {this.renderDates().years}
            </Input>
          </Col>
        </Row>

        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="Email (e.g. example@email.com)"
            onChange={this.handleInputChange}
          />
        </FormGroup>

        <FormGroup>
          <Label for="phone">Phone</Label>
          <Input
            type="phone"
            id="phone"
            placeholder="Phone Number (e.g. 012-345-6789)"
            onChange={this.handleInputChange}
          />
        </FormGroup>

        <FormGroup>
          <Label for="blurb">Personal Bio</Label>
          <FormText color="muted">Tell us, and your followers, a little bit about you!</FormText>
          <Input type="textarea" id="blurb" onChange={this.handleInputChange} />
        </FormGroup>

        <FormGroup>
          <Label for="affiliation">Affiliation</Label>
          <Input type="select" id="affiliation" onChange={this.handleInputChange}>
            <option />
            <option>Other</option>
            <option>Democrat</option>
            <option>Republican</option>
            <option>Independent</option>
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for="username">Username</Label>
          <Input
            type="text"
            id="username"
            placeholder="Username (e.g. tmay)"
            onChange={this.handleInputChange}
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
        <div className="center-row" id="submit">
          <Button id="submit" onClick={this.handleSubmit}>
            Submit
          </Button>
        </div>
      </Form>
    );
  }
}

export default Registration;
