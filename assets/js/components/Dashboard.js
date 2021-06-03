import React, {Component, useState} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import NestedList from '../classes/NestedList';
import { Redirect } from 'react-router';
import {Link} from "react-router-dom";
import axios from 'axios';

class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            user: window.REACT_SERVER_PROPS.user,
            loading: true, token: window.REACT_SERVER_PROPS.token,
            data: false,
            hasError: false,
            status: 200
        };
    }
    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
        console.error("Error: "+error+" (info)");
    }

    callApi(target, method = "GET", callback = null, errorCallback = null) {
        let uri="/api/"+target;
        console.debug("trigger "+method+" request to API ("+uri+") with token "+this.state.token);
        axios.post(
            uri,
            {title: 'TestTest', description: 'description'},
            {headers: {'Authorization': `Bearer ${this.state.token}`}}
        ).then(result => {
            if (callback === null) {
                console.debug(result.data);
                this.setState({status: result.status, loading: false, payload: result.data});
            } else {
                callback(result.data, this);
            }
        }).catch(error => {
            let status = 500;
            if (errorCallback === null) {
                if (error.response) {
                    console.error("Request responded with an error ["+error.response.status+"].");
                    console.debug(error.response);
                    status = error.response.status;
                } else if (error.request) {
                    console.error("timeout")
                    console.debug(error.request);
                }
                this.setState({status: status, success: false, loading: false, hasError: true});
            } else {
                console.debug(error);
                console.error("Error occurred: " + error);
            }
        });

        return null;
    }
    componentDidMount() {
        this.getUserData();
    }
    getUserData() {
        let callback = function(data, that) {
            let userData = JSON.parse(data);
            console.debug(data);
            console.debug("successfully retrieved user data with ["+userData.projects.length+"] projects");
            that.setState({ status: data.status, success: true, loading: false, userData: userData});
        }
        this.callApi("me", "GET", callback);
    }
    createProject() {
        console.debug("creating project");
        let callback = function(data, that) {
            console.debug("created a new project");
            that.getUserData();
        }
        this.callApi("project", "POST", callback);
    }
    render() {
        if(!this.state.user || this.state.status === 401) {
            return <Redirect to={"/login"} />
        }
        this.title = "Welcome "+this.state.user.name;
        const loading = this.state.loading;
        const token = this.state.token;
        return(
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow key={"heading-"+this.title}>
                            <TableCell>
                                <h1>{this.title}</h1>
                                <h4>This is your <strong>hirefly</strong> dashboard</h4>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
                <div>{ new NestedList().renderData("data", this.state.user) }</div>
                <div><Button variant="contained" color="primary" onClick={this.createProject.bind(this)}>create Project</Button></div>
                {loading || this.state.userData === undefined ? (
                    <div className={'row text-center'}>
                        <span className="fa fa-spin fa-spinner fa-4x"></span>
                    </div>
                ) : (
                    <div>
                        { new NestedList().renderData("data", {projects: this.state.userData.projects}) }
                    </div>
                )}
            </Paper>
        )
    }
}
export default Dashboard;