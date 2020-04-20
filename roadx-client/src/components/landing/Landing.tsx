import React from 'react';
import LoginView from './LoginView';
import '../../styles/landing.css';

interface ILandingProps {
    submitUsernamePassword: (username: string, password: string) => void;
}

export default class Landing extends React.Component<ILandingProps, {}> {
    render() {
        const { submitUsernamePassword } = this.props;

        return (
            <div className="landing__contents">
                <div className="landing__logo"> 
                    <div className="landing__logo-text"> Road X</div>
                </div>
                <div className="landing__login_view">
                    <LoginView submitUsernamePassword={submitUsernamePassword}/>
                </div>
                <div className="landing__logo-footer">
                    <div >Automated Road Defect Discovery System</div>
                    <div >City of Philadelphia </div>
                </div>
                
            </div>
        )
    }
}