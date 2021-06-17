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
import Editor from "./Editor";

class Dashboard extends Component {
    network = undefined;
    editor = undefined;
    constructor() {
        super();
        this.state = {
            user: window.REACT_SERVER_PROPS.user,
            editMode: false
        };
        this.editorRef = React.createRef();
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
            console.debug(data);
            let userData = JSON.parse(data);
            console.debug("successfully retrieved user data with ["+userData.projects.length+"] projects");
            that.setState({ user: userData, status: data.status, success: true, loading: false, userData: userData});
        }
        this.network.callApi("me", undefined,"POST", callback);
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
        this.editorRef.current.setEntity("user",this.state.userData.id, ["id","projects","createdAt"]);
        if (this.editorRef.current.state.data === this.state.userData) {
            this.editorRef.current.toggle();
        } else {
            this.editorRef.current.handleOpen();
            this.editorRef.current.setData(this.state.userData);
        }

    }
    editProject(data, action, event) {
        var that = this;
        let callback = function(data) {
            console.debug("project has been "+action+"d.");
            that.getUserData();
        }
        if (action === "delete") {
            this.network.callApi("project/"+data.id, undefined, "DELETE", callback);
        }
        if (action === "edit") {
            this.editorRef.current.setEntity("project",data.id, ["id", "createdAt"]);
            if (this.editorRef.current.state.data === data) {
                this.editorRef.current.toggle();
            } else {
                this.editorRef.current.handleOpen();
                this.editorRef.current.setData(data);
            }
            //data.description += " edited";
            //this.network.callApi("project/"+data.id, data, "PUT", callback);
        }
        console.debug(action + " project #"+data.id);
    }
    submitChanges(data, entity, id, event) {
        console.debug("submitting changes for entity "+entity+" #"+id+"...");
        console.debug(data);
        let that = this;
        let callback = function (data) {
            console.debug("data has been successfully persisted");
            that.editorRef.current.handleClose();
            that.getUserData();
        }
        let errorCallback = function (error) {
            console.error("an error has occurred while trying to persist data");
            that.setState({status: error.response.status});
            console.error(error.response);
        }
        this.network.callApi(entity+"/"+id, data, "PUT", callback, errorCallback);
    }
    filter (obj, keys) {
        let result = {}, key;
        for (let i in keys) {
            key = keys[i];
            if (obj.hasOwnProperty(key)) {
                result[key] = obj[key];
            }
        }
        return result;
    }
    render() {
        if(!this.state.user || this.state.status === 401) {
            return <Redirect to={"/redirect?to=/login"} />
        }
        let callbacks = this.editProject.bind(this);
        this.title = "Welcome "+this.state.user.name;
        const loading = this.state.loading;

        let user = this.filter(this.state.user, ["id","name","email"]);

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
                <div>
                    { new NestedList().renderData("user", user) }
                </div>
                <Button variant="contained" color="primary" onClick={this.editProfile.bind(this)}>edit Profile</Button>
                {loading || this.state.userData === undefined ? (
                    <div className={'row text-center'}>
                        <span className="fa fa-spin fa-spinner fa-4x"></span>
                    </div>
                ) : (
                    <div>
                        { new NestedList(callbacks,{edit:"primary",delete:"secondary"}).renderData("data", {projects: this.state.userData.projects}, "alternateRows") }
                    </div>
                )}
                <div>
                <Button variant="contained" color="primary" onClick={this.createProject.bind(this)}>create Project</Button>
                </div>
                <Editor ref={this.editorRef} submitCallback={this.submitChanges.bind(this)}/>
            </Paper>
        )
    }
}
export default Dashboard;