//Login Box
import React, {Component} from 'react';
import axios from 'axios';
import Home from './Home';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: ''
        }
    }

    submitLogin(e) {
        console.log("submitting the form..");
        axios.post(`/auth/login`, this.state).then(result => {
            console.log(this.state);
            if (result.data.token) {
                this.props.setToken(result.data.token);
                this.setState({ success: true, loading: false, token: result.data.token});
            } else {
                this.setState({ result: result.data, success: false, loading: false});
            }
            console.log(this.state);
        })
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
                    Login
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

                    <button
                        type="button"
                        className="login-btn"
                        onClick={this
                            .submitLogin
                            .bind(this)}>Login</button>
                </div>
            </div>
        );
    }

}

export default Login;