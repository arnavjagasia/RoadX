import React, { Component } from 'react';
import { Form, FormGroup, Input, Button, Row, Col, Table } from 'reactstrap';

import '../../css/dashboard.css';
import '../../css/header.css';
import '../../css/table.css';

class BulletinBoardPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submissionComplete: false,
    };
    this.deleteMessage = this.deleteMessage.bind(this);
    this.postMessage = this.postMessage.bind(this);
    this.cancelMessage = this.cancelMessage.bind(this);
    console.log(this.props.messages);
  }

  postMessage() {
    var searchname = this.props.policymaker.username;
    var messageTitle = document.getElementById('messageTitle').value;
    var message = document.getElementById('messageContent').value;
    var topics = this.props.policymaker.chosenTopics;
    var name = this.props.policymaker.firstName + ' ' + this.props.policymaker.lastName;

    if (messageTitle.length === 0 || message.length === 0) {
      return;
    }

    console.log(searchname);
    console.log(messageTitle);
    console.log(message);

    var now = new Date();
    var date = now.getMonth() + '/' + now.getDate() + '/' + now.getFullYear();

    fetch('http://localhost:9000/api/postmessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: messageTitle,
        content: message,
        date: date,
        username: searchname,
        topics: topics,
        name: name,
      }),
    }).then(res => window.location.reload());
  }

  cancelMessage() {
    var form = document.getElementById('new-message-form');
    form.reset();
  }

  deleteMessage(event) {
    var searchname = this.props.policymaker.username;
    var id = event.target.value;

    var messageTitle = document.getElementById('title ' + id).textContent;

    fetch('http://localhost:9000/api/deletemessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: messageTitle,
        username: searchname,
      }),
    }).then(res => window.location.reload());
  }

  render() {
    const tablerows = this.props.messages.map((message, i) => {
      return (
        <tr>
          <td id={'title ' + i}>{message.title}</td>
          <td>{message.content}</td>
          <td>{message.date}</td>
          <td>
            <Button value={i} onClick={this.deleteMessage}>
              Delete
            </Button>
          </td>
        </tr>
      );
    });

    return (
      <div className="dashboard-panel-container">
        <h1>Your Bulletin Board</h1>
        <h3>Post messages to your patrons!</h3>

        <div className="dashboard-bulletin-mesage-form">
          <Form id="new-message-form">
            <FormGroup>
              <Input
                type="text"
                id="messageTitle"
                placeholder="Message Title"
                onChange={this.handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="textarea"
                id="messageContent"
                placeholder="What do you want to tell your patrons?"
                onChange={this.handleInputChange}
              />
            </FormGroup>
            <Row>
              <Col md={4} />
              <Col md={2}>
                <Button onClick={this.postMessage}>Post</Button>
              </Col>
              <Col md={2}>
                <Button onClick={this.cancelMessage}>Cancel</Button>
              </Col>
              <Col md={4} />
            </Row>
          </Form>
        </div>

        <Form>
          <div className="dashboard-transaction-table">
            <Table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Message</th>
                  <th>Date Posted</th>
                  <th />
                </tr>
              </thead>
              <tbody>{tablerows}</tbody>
            </Table>
          </div>
        </Form>
      </div>
    );
  }
}

export default BulletinBoardPanel;
