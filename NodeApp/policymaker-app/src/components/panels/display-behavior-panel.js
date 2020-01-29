import React, { Component } from 'react';
import { Row, Col, Table } from 'reactstrap';
import { Bar, Pie } from 'react-chartjs-2';

import '../../css/dashboard.css';
import '../../css/header.css';
import '../../css/table.css';

class DisplayBehaviorPanel extends Component {
  render() {
    var tablemap = new Map();
    if (this.props.transactions) {
      for (var i = 0; i < this.props.transactions.length; i++) {
        var behavior = this.props.transactions[i].behavior;
        if (!tablemap.get(behavior)) {
          tablemap.set(behavior, 1);
        } else {
          tablemap.set(behavior, tablemap.get(behavior) + 1);
        }
      }
    }

    var behaviors = [];
    var counts = [];

    for (let [key, val] of tablemap.entries()) {
      behaviors.push(key);
      counts.push(val);
    }
    console.log(behaviors);
    console.log(counts);

    var mydata = {
      labels: behaviors,
      datasets: [
        {
          label: 'Linked Behaviors',
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
          ],
          borderColor: 'rgba(0, 0, 0, 0)',
          data: counts,
        },
      ],
    };

    var myoptions = {
      scales: {
        yAxes: [
          {
            ticks: {
              min: 0,
            },
          },
        ],
      },
    };

    const headercols = behaviors.map((behavior, i) => {
      return <th>{behavior}</th>;
    });

    const tablevals = counts.map((count, i) => {
      return <td>{count}</td>;
    });

    console.log(this.props.transactions);
    console.log(this.props.transactions[0]);

    return (
      <div className="dashboard-panel-container">
        <h1>Matched Behaviors</h1>
        <h3>See what behaviors your patrons have linked to donations.</h3>

        <div className="dashboard-transaction-table">
          <Row>
            <Col md={6}>
              <Pie data={mydata} />
            </Col>
            <Col md={6}>
              <Bar data={mydata} options={myoptions} />
            </Col>
          </Row>

          <div className="dashboard-behavior-table">
            <Table>
              <thead>
                <tr>{headercols}</tr>
              </thead>
              <tbody>{tablevals}</tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

export default DisplayBehaviorPanel;
