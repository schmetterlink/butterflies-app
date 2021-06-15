import React, {Component, useState} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { Redirect } from 'react-router';
import {Link} from "react-router-dom";
import NestedList from "../classes/NestedList";
import Network from "../classes/Network";

class Dashboard extends Component {
    network = undefined;
    constructor() {
        super();
        this.state = {
            user: window.REACT_SERVER_PROPS.user
        };
        this.network = new Network(this, window.REACT_SERVER_PROPS.token);
    }
    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
        console.error("Error: "+error+" (info)");
    }

    componentDidMount() {
        this.getUserData();
    }
    getUserData() {
        var that = this;
        let callback = function(data) {
            let userData = JSON.parse(data);
            console.debug(data);
            console.debug("successfully retrieved user data with ["+userData.projects.length+"] projects");
            that.setState({ status: data.status, success: true, loading: false, userData: userData});
        }
        this.network.callApi("me", undefined,"GET", callback);
    }
    createProject() {
        console.debug("creating project");
        var that = this;
        let callback = function(data) {
            console.debug("created a new project");
            that.getUserData();
        }
        this.network.callApi("project", {title: 'TestTestTest', description: 'lorem ipsissimum'}, "POST", callback);
    }
    editProfile() {
        console.debug("edit user profile");
    }
    editProject(data, action, event) {
        if (action === "delete") {
            var that = this;
            let callback = function(data) {
                console.debug("project has been deleted.");
                that.getUserData();
            }
            this.network.callApi("project/"+data.id, undefined, "DELETE", callback);
        }
        if (action === "edit") {
            this.network.callApi("project", data, "PUT");
        }
        console.debug(action + " project #"+data.id);
    }
    render() {
        if(!this.state.user || this.state.status === 401) {
            return <Redirect to={"/login"} />
        }
        let callbacks = this.editProject.bind(this);
        this.title = "Welcome "+this.state.user.name;
        const loading = this.state.loading;
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
                <div>{ new NestedList().renderData("data", this.state.user) }
                </div>
                {loading || this.state.userData === undefined ? (
                    <div className={'row text-center'}>
                        <span className="fa fa-spin fa-spinner fa-4x"></span>
                    </div>
                ) : (
                    <div>
                        { new NestedList(callbacks).renderData("data", {projects: this.state.userData.projects}) }
                    </div>
                )}
                <div>
                <Button variant="contained" color="primary" onClick={this.createProject.bind(this)}>create Project</Button>
                <Button variant="contained" color="primary" onClick={this.editProfile.bind(this)}>edit Profile</Button>
                </div>
            </Paper>
        )
    }
}
export default Dashboard;