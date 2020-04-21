import React from "react";
import './App.css';
import PlatformApp from './components/PlatformApp';
import Landing from "./components/landing/Landing";

interface IAppState {
  username: string | undefined,
  password: string | undefined,
}

export default class App extends React.Component<{}, IAppState> {
  state: IAppState = {
    username: undefined,
    password: undefined,
  }

  submitUsernamePassword = (username: string, password: string) => {
    this.setState({
      username: username,
      password: password
    })
  }

  logout = () => {
    this.setState({
        username: undefined,
        password: undefined,
    })
  }
  
  renderLanding() {
    return (
      <div className="App">
        <Landing submitUsernamePassword={this.submitUsernamePassword} />
      </div>
     );
  }

  renderPlatform() {
    return (
      <div className="App">
        <PlatformApp logout={this.logout}/>
      </div>
     );
  }

  render() {
    if (this.state.username && this.state.password) {
      return(this.renderPlatform())
    } else {
      return(this.renderLanding())
    }
  }
}

