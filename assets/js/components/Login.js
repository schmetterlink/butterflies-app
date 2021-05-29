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
                this.props.grantAccess(result.data);
            } else {
                console.warn("authentication request rejected.");
            }
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