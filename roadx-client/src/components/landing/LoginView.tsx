import React from 'react';

import '../../styles/landing.css'
import { Card, InputGroup, Button, Toaster, Position, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import '../../styles/landing.css';

const LoginToaster = Toaster.create({
    className: "login-toaster",
    position: Position.TOP,
});

interface ILoginViewProps {
    submitUsernamePassword: (username: string, password: string) => void;
}

interface ILoginViewState {
    username: string | undefined,
    password: string | undefined,
}

export default class LoginView extends React.Component<ILoginViewProps, ILoginViewState> {
    state: ILoginViewState = {
        username: undefined,
        password: undefined,
    }

    addUsername = (e: any) => {
        this.setState({
            username: e.target.value
        })
    }

    addPassword = (e: any) => {
        this.setState({
            password: e.target.value
        })
    }
    
    handleSubmitUsernamePassword = () => {
        const { username, password } = this.state;
        if (!username) {
            LoginToaster.show({ 
                message: "Please enter your username",
                intent: Intent.WARNING,
            });
        }
        if (!password) {
            LoginToaster.show({ 
                message: "Please enter your password",
                intent: Intent.WARNING,
            });
        }

        this.props.submitUsernamePassword(username, password)
    }

    render() {
        return(
            <Card className="login_view__container">
                <InputGroup
                    className="login_view__entry"
                    placeholder="Username"
                    leftIcon={IconNames.PERSON}
                    onChange={this.addUsername}
                />
                <InputGroup
                    className="login_view__entry"
                    placeholder="password"
                    type="password"
                    leftIcon={IconNames.LOCK}
                    onChange={this.addPassword}
                />
                <Button 
                    className="login_view__button"
                    text={"Login"} 
                    intent={Intent.PRIMARY}
                    onClick={this.handleSubmitUsernamePassword}
                />
            </Card>

        )
    }
}