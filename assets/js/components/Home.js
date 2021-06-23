import React, {Component} from 'react';
import {Route, Switch,Redirect, Link, withRouter} from 'react-router-dom';
import Dashboard from "./Dashboard";
import Login from './Login';
import Logout from './Logout';
import Signup from './Signup';

class Home extends Component {
    constructor() {
        super();
        console.log(window.REACT_SERVER_PROPS);
        this.state = { user: window.REACT_SERVER_PROPS.user };
    }
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <Link className={"navbar-brand"} to={"/"}>
                        <img
                            src={'/build/images/ci/hirefly-final-magenta-black-matte-animated.gif'}
                            alt='hirefly.de'/>
                        <span className="brand"><span style={{color: "var(--primary-1)"}}>hire</span><span
                            style={{color: "var(--primary-2)"}}>fly</span><span
                            style={{color: "var(--gray-1-70)"}}>.de</span></span>
                    </Link>
                    <div className="collapse navbar-collapse" id="navbarText">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                {this.state.user === null
                                    ?
                                    <Link className={"nav-link"} to={"/signup"}> Subscribe </Link>
                                    :
                                    <Link className={"nav-link"} to={"/dashboard"}> Dashboard </Link>
                                }
                            </li>
                            <li className="nav-item">
                                {this.state.user === null
                                    ?
                                    <span>
                                        <Link className={"nav-link"} to={"/login"}> Login </Link>
                                    </span>
                                    : <Link className={"nav-link"} to={"/logout"}> Logout </Link>
                                }
                            </li>

                        </ul>
                    </div>
                </nav>
                <Switch>
                    <Redirect exact from="/" to="/login"/>
                    <Route path="/dashboard" component={Dashboard}/>
                    <Route path="/login" component={Login} />
                    <Route path="/logout" component={Logout}/>
                    <Route path="/signup" component={Signup}/>
                </Switch>
            </div>
        )
    }
}



export default Home;