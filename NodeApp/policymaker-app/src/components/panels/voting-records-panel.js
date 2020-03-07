import React, { Component } from 'react';
import { Form, Button, Table } from 'reactstrap';

import '../../css/dashboard.css';
import '../../css/header.css';
import '../../css/table.css';

class VotingRecordsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submissionComplete: false,
    };
    this.setVotes = this.setVotes.bind(this);
  }

  setVotes() {
    var searchname = this.props.policymaker.username;

    var votes = document.getElementsByName('vote');

    votes.forEach(vote => {
      var recordTitle = document.getElementById(
        'title ' + vote.options[vote.selectedIndex].value.split(' ')[1],
      ).textContent;
      fetch('http://localhost:9000/api/setvote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: recordTitle,
          vote: vote.options[vote.selectedIndex].value.split(' ')[0],
          username: searchname,
        }),
      }).then(res => window.location.reload());
    });
  }

  render() {
    const tablerows = this.props.records.map((record, i) => {
      console.log(this.props.policymaker.username);
      var yes = record.votedYes.indexOf(this.props.policymaker.username) > -1;
      var no = record.votedNo.indexOf(this.props.policymaker.username) > -1;
      if (yes) {
        return (
          <tr>
            <td id={'title ' + i}>{record.title}</td>
            <td>{record.description}</td>
            <td>{record.topic}</td>
            <td>
              <select name={'vote'}>
                <option value={'yay ' + i} selected>
                  For
                </option>
                <option value={'nay ' + i}>Against</option>
                <option value={'noVote ' + i}>No Vote</option>
              </select>
            </td>
          </tr>
        );
      } else if (no) {
        return (
          <tr>
            <td id={'title ' + i}>{record.title}</td>
            <td>{record.description}</td>
            <td>{record.topic}</td>
            <td>
              <select name={'vote'}>
                <option value={'yay ' + i}>For</option>
                <option value={'nay ' + i} selected>
                  Against
                </option>
                <option value={'noVote ' + i}>No Vote</option>
              </select>
            </td>
          </tr>
        );
      } else {
        return (
          <tr>
            <td id={'title ' + i}>{record.title}</td>
            <td>{record.description}</td>
            <td>{record.topic}</td>
            <td>
              <select name={'vote'}>
                <option value={'yay ' + i}>For</option>
                <option value={'nay ' + i}>Against</option>
                <option value={'noVote ' + i} selected>
                  No Vote
                </option>
              </select>
            </td>
          </tr>
        );
      }
    });

    return (
      <div className="dashboard-panel-container">
        <h1>Your Voting Record</h1>
        <h3>Show patrons how you've supported the causes you care about.</h3>
        <Form>
          <div className="dashboard-transaction-table">
            <Table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Cause</th>
                  <th>Your Vote</th>
                </tr>
              </thead>
              <tbody>{tablerows}</tbody>
            </Table>
          </div>

          <div className="center-row" id="submit">
            <Button id="saveTopics" onClick={this.setVotes}>
              Save
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default VotingRecordsPanel;
