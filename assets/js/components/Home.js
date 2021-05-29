import React, {Component} from 'react';
import {Route, Switch,Redirect, Link, withRouter} from 'react-router-dom';
import Users from './Users';
import Posts from './Posts';
import Dashboard from "./Dashboard";
import Login from './Login';
import Logout from './Logout';

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
                    <Link className={"navbar-brand"} to={"/"}> Hirefly.de </Link>
                    <div className="collapse navbar-collapse" id="navbarText">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className={"nav-link"} to={"/posts"}> Posts </Link>
                            </li>

                            <li className="nav-item">
                                <Link className={"nav-link"} to={"/users"}> Users </Link>
                            </li>

                            <li className="nav-item">
                                <Link className={"nav-link"} to={"/dashboard"}> Dashboard </Link>
                            </li>
                            <li className="nav-item">
                            {this.state.user === null
                                ?
                                <Link className={"nav-link"} to={"/login"}> Login </Link>
                                : <Link className={"nav-link"} to={"/logout"}> Logout </Link>
                            }
                            </li>
                        </ul>
                    </div>
                </nav>
                <Switch>
                    <Redirect exact from="/" to="/users" />
                    <Route path="/users" component={Users} />
                    <Route path="/posts" component={Posts} />
                    <Route path="/dashboard" component={Dashboard} />
                    <Route path="/login" component={Login} />
                    <Route path="/logout" component={Logout} />
                </Switch>
            </div>
        )
    }
}



export default Home;