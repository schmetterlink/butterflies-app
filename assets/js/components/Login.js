//Login Box
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Button from "@material-ui/core/Button";
import BaseComponent from "./BaseComponent";

class Login extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: ''
        }
    }

    componentWillUnmount() {
        /*
        / overwrite setState-method to avoid state updates on unmounted components
        / as suggested here: https://stackoverflow.com/a/61055910/8800495
        */
        this.setState = (state,callback)=>{
            return null;
        };
    }

    submitLogin(e) {
        console.log("requesting authentication token..");
        axios.post(`/auth/login`, this.state).then(result => {
            this.setState({ success: true, loading: false, payload: result.data});
            if (result.data.token) {
                console.log("authentication request granted.");
                window.location.href='dashboard?token='+result.data.token.replace('Bearer ','',1);
            } else {
                console.warn("authentication request rejected.");
            }
        })
    }

    submitRegistration(e) {
        console.log("Register new user..");
        console.log(this.state);
        axios.post(`/auth/register`, this.state).then(result => {
            console.log(result);
            this.setState({ success: true, loading: false, payload: result.user});
            if (result.status === 200) {
                this.submitLogin(e);
            } else {
                console.warn("registration rejected.");
                console.error(result);
            }
        }).catch(error => {
            console.warn("registration rejected.");
            console.error(error.response);
        });
    }

    handleChange(e) {
        // If you are using babel, you can use ES 6 dictionary syntax
        // let change = { [e.target.name] = e.target.value }
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    render() {
        return (
            <div className="inner-container">
                <div className="header">
                    <h2>Login</h2>
                    <div>
                        Please enter your account credentials in order to log in to your hirefly account.
                    </div>
                    <div>
                        You do not have an account yet? Please <Link to={"/signup"}>register</Link> here.
                    </div>
                </div>
                <div className="box">

                    <div className="input-group">
                        <label htmlFor="username">Email</label>
                        <input
                            type="text"
                            name="email"
                            onChange={this.handleChange.bind(this)}
                            className="login-input"
                            placeholder="Username"/>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={this.handleChange.bind(this)}
                            className="login-input"
                            placeholder="Password"/>
                    </div>

                    <Button
                        type="button"
                        className="login-btn"
                        variant="contained"
                        color="primary"
                        onClick={this
                            .submitLogin
                            .bind(this)}>Login</Button>

                    <Button
                        type="button"
                        className="reset"
                        variant="contained"
                        color="secondary"
                        onClick={super
                            .resetInputs
                            .bind(this)}>Reset</Button>
                </div>
            </div>
        );
    }

}

export default Login;