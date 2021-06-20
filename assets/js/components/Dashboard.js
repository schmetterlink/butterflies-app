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
        this.network.callApi("/api/me", undefined, "POST", callback);
    }
    createEntity(entity, data = {title: 'title', description: 'lorem ipsum'}, event) {
        console.debug("creating "+entity);
        console.debug(data);
        var that = this;
        let callback = function(newEntity) {
            console.debug("created a new "+entity+":");
            console.debug(newEntity);
            that.getUserData();
        }
        this.network.callApi("/api/" + entity, data, "POST", callback);
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
    editEntity(data, action, event) {
        console.debug("editEntity callback triggered");
        console.debug(action);
        var that = this;
        let callback = function(data) {
            console.debug("project has been "+action.name+"d.");
            that.getUserData();
        }
        if (action.name === "delete") {
            this.network.callApi("/api/" + action.entity + "/" + data.id, undefined, "DELETE", callback);
        }
        if (action.name === "edit") {
            this.editorRef.current.setEntity(action.entity,data.id, ["id", "createdAt"]);
            if (this.editorRef.current.state.data === data) {
                this.editorRef.current.toggle();
            } else {
                this.editorRef.current.handleOpen();
                this.editorRef.current.setData(data);
            }
            //data.description += " edited";
            //this.network.callApi("project/"+data.id, data, "PUT", callback);
        }
        console.debug(action.name + " "+ action.entity +" #"+data.id);
    }
    submitChanges(data, entity, id) {
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
        this.network.callApi("/api/" + entity + "/" + id, data, "PUT", callback, errorCallback);
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
            window.location.href="/redirect?to=/login&message=your session has expired.";
        }
        let callbacks = this.editEntity.bind(this);
        this.title = "Welcome "+this.state.user.name;
        const loading = this.state.loading;

        let user = this.filter(this.state.user, ["id","name","email"]);

        return(
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow key={"heading-dashboard"}>
                            <TableCell>
                                <h1>{this.title}</h1>
                                <h4>This is your <strong>hirefly</strong> dashboard</h4>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
                {loading || this.state.userData === undefined ? (
                    <div className={'row text-center'}>
                        <span className="fa fa-spin fa-spinner fa-4x"></span>
                    </div>
                ) : (
                    <div>
                        { new NestedList().renderData("user", user) }
                        <Button variant="contained" color="primary" onClick={this.editProfile.bind(this)}>edit
                            Profile</Button>
                        { new NestedList(
                            [
                                {name: "edit", class: "primary", callback: this.editEntity.bind(this), entity: "project"},
                                {name: "delete", class: "secondary", callback: this.editEntity.bind(this), entity: "project"}
                            ]
                            )
                            .renderData(
                                "data",
                                {projects: this.state.userData.projects},
                                "alternateRows"
                            )
                        }
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.createEntity.bind(this,"project",{title: "Test-Project", description: "Description"})}
                        >
                            create Project
                        </Button>
                        { new NestedList(
                            [
                                {name: "edit", class: "primary", callback: this.editEntity.bind(this), entity: "file"},
                                {name: "delete", class: "secondary", callback: this.editEntity.bind(this), entity: "file"}
                            ])
                            .renderData(
                                "data",
                                {files: this.state.userData.files},
                                "alternateRows"
                            )
                        }
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.createEntity.bind(this,"file",{uri: "media/file/blub.jpg", title: "media file", description: "media file description"})}
                        >
                            create File
                        </Button>
                    </div>
                )}
                <Editor ref={this.editorRef} submitCallback={this.submitChanges.bind(this)}/>
            </Paper>
        )
    }
}
export default Dashboard;