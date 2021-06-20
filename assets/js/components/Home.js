import React, {Component} from 'react';
import {Route, Router, Switch, Redirect, Link, withRouter} from 'react-router-dom';
import Dashboard from "./Dashboard";
import Login from './Login';
import Logout from './Logout';
import Signup from './Signup';
import {Navbar} from 'react-bootstrap/Navbar'

//import 'bootstrap/dist/css/bootstrap.css';

class Home extends Component {
    constructor() {
        super();
        console.log(window.REACT_SERVER_PROPS);
        this.state = {user: window.REACT_SERVER_PROPS.user};
    }

    render() {
        return (

            <div>
                <Navbar className="navbar navbar-expand-lg navbar-dark bg-dark">

                    <Link className={"navbar-brand"} to={"/"}><img
                        src={'/build/images/ci/hirefly-final-magenta-black-matte-animated.gif'}
                        alt='hirefly.de'/></Link>
                    <div className="collapse navbar-collapse" id="navbarText">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className={"nav-link"} to={"/dashboard"}> Dashboard </Link>
                            </li>
                            <li className="nav-item">
                                {this.state.user === null
                                    ?
                                    <span>
                                    <Link className={"nav-link"} to={"/login"}> Sign In </Link>
                                </span>
                                    : <Link className={"nav-link"} to={"/logout"}> Logout </Link>
                                }
                            </li>
                        </ul>
                    </div>
                </Navbar>
                <Switch>
                    <Redirect exact from="/" to="/users"/>
                    <Route path="/dashboard" component={Dashboard}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/logout" component={Logout}/>
                    <Route path="/signup" component={Signup}/>
                </Switch>
            </div>

        )
    }
}



export default Home;