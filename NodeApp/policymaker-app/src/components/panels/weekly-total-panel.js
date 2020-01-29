import React, { Component } from 'react';
import { Row, Col, Table } from 'reactstrap';
import { Line } from 'react-chartjs-2';
import '../../css/dashboard.css';
import '../../css/header.css';
import '../../css/table.css';

class WeeklyTotalPanel extends Component {
  render() {
    var total = 0;
    var d = new Date();
    var weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    var weekTransactions = [];
    var weekStrings= [];
    var tablemap = new Map();


    var dates= [];
    for(var i= 0; i< 7; i++)
    {
      var y= new Date(); 
      y.setDate(y.getDate() - 7 + i);
      tablemap.set(y.toLocaleDateString(), 0);
      dates.push(y.toLocaleDateString());
    }

    if (this.props.transactions) {
      for(var i = 0; i < this.props.transactions.length; i++)
      {
        var x= this.props.transactions[i]
        var datestring = x.month.toString() + "-" + x.day.toString() + "=" + x.year.toString()
        var date= new Date(datestring)
        if(date.getTime() >= weekAgo.getTime())
        {
          weekTransactions.push(x)
          weekStrings.push(x.toString())
          var shortDate= date.toLocaleDateString()
          if(!tablemap.get(shortDate))
          {
            tablemap.set(shortDate, x.amount)
          }
          else
          {
            tablemap.set(shortDate, tablemap.get(shortDate) + x.amount)
          }
        }
      }

      weekTransactions.forEach(t =>{
        total += t.amount;
      })  
    }


    var amounts = [];
    dates.forEach(z =>{
      amounts.push(tablemap.get(z));
    })  

    const data = {
      labels: dates,
      datasets: [
        {
          label: 'Amount in Dollars',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: amounts
        }
      ]
    };

    

    return (
      <div className="dashboard-panel-container">
        <h1>Weekly Donations</h1>
        <h3>See how well you did!</h3>

        <div className="dashboard-weekly-donations">
          <Row>
            <Col md={3}>
              <h2> Weekly Donations</h2>
              <h1>${total.toFixed(2)}</h1>
            </Col>
            <Col md={1}>
            </Col>
            <Col md={8}>
              <Line data={data}/>
            </Col>
          </Row>
          
        </div>
      </div>
    );
  }
}

export default WeeklyTotalPanel;
