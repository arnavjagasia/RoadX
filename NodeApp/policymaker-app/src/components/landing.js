import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import Welcome from './welcome.js';
import About from './about.js';
import Login from './login.js';
import Registration from './registration.js';
import RequestReset from './request-reset.js';
import ResetPassword from './reset-password.js';
import BankAccount from './bank-account.js';
import '../css/landing.css';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      hasRegistration: false,
      hasRequestReset: false,
      hasResetPassword: false,
      hasBankAccount: false,
      hasAbout: false,
      resetCode: '',
    };

    this.renderPanel = this.renderPanel.bind(this);
    this.renderWelcome = this.renderWelcome.bind(this);
    this.switchToRegistration = this.switchToRegistration.bind(this);
    this.switchToRequestReset = this.switchToRequestReset.bind(this);
    this.switchToResetPassword = this.switchToResetPassword.bind(this);
    this.switchToBankAccount = this.switchToBankAccount.bind(this);
    this.switchToAbout = this.switchToAbout.bind(this);
    this.switchResetCode = this.switchResetCode.bind(this);
  }

  switchToRegistration(toggle) {
    this.setState({ hasRegistration: toggle });
  }

  switchToRequestReset(toggle) {
    this.setState({ hasRequestReset: toggle });
  }

  switchToResetPassword(toggle) {
    this.setState({ hasResetPassword: toggle });
  }

  switchToBankAccount(toggle) {
    this.setState({ hasBankAccount: toggle });
  }

  switchToAbout(toggle) {
    this.setState({ hasAbout: toggle });
  }
  switchResetCode(code) {
    this.setState({ resetCode: code });
  }

  renderPanel(hasRegistration, hasRequestReset, hasResetPassword, hasBankAccount) {
    if (this.state.hasRegistration) {
      return (
        <Registration
          switchToRegistration={this.switchToRegistration}
          switchToRequestReset={this.switchToRequestReset}
          switchToResetPassword={this.switchToResetPassword}
          switchToBankAccount={this.switchToBankAccount}
          switchResetCode={this.switchResetCode}
          setUser={this.props.setUser}
        />
      );
    } else if (this.state.hasRequestReset) {
      return (
        <RequestReset
          switchToRegistration={this.switchToRegistration}
          switchToRequestReset={this.switchToRequestReset}
          switchToResetPassword={this.switchToResetPassword}
          switchToBankAccount={this.switchToBankAccount}
          switchResetCode={this.switchResetCode}
          setUser={this.props.setUser}
          username={this.state.username}
        />
      );
    } else if (this.state.hasResetPassword) {
      return (
        <ResetPassword
          switchToRegistration={this.switchToRegistration}
          switchToRequestReset={this.switchToRequestReset}
          switchToResetPassword={this.switchToResetPassword}
          switchToBankAccount={this.switchToBankAccount}
          switchResetCode={this.switchResetCode}
          resetCode={this.state.resetCode}
          setUser={this.props.setUser}
          username={this.state.username}
        />
      );
    } else if (this.state.hasBankAccount) {
      return (
        <BankAccount
          switchToRegistration={this.switchToRegistration}
          switchToRequestReset={this.switchToRequestReset}
          switchToResetPassword={this.switchToResetPassword}
          switchToBankAccount={this.switchToBankAccount}
          switchResetCode={this.switchResetCode}
          setUser={this.props.setUser}
          username={this.state.username}
        />
      );
    } else {
      return (
        <Login
          switchToRegistration={this.switchToRegistration}
          switchToRequestReset={this.switchToRequestReset}
          switchToResetPassword={this.switchToResetPassword}
          switchToBankAccount={this.switchToBankAccount}
          switchResetCode={this.switchResetCode}
          setUser={this.props.setUser}
        />
      );
    }
  }

  renderWelcome(hasAbout) {
    if (!this.state.hasAbout) {
      return <Welcome switchToAbout={this.switchToAbout} />;
    } else {
      return <About switchToAbout={this.switchToAbout} />;
    }
  }

  render() {
    return (
      <div className="landing-container">
        <Row>
          <Col md={8} className="welcome-container">
            {this.renderWelcome(this.state.hasAbout)}
          </Col>
          <Col md={4} className="login-container">
            <div className="login-div">
              {this.renderPanel(
                this.state.hasRegistration,
                this.state.hasRequestReset,
                this.state.hasResetPassword,
                this.state.hasBankAccount,
              )}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Landing;
