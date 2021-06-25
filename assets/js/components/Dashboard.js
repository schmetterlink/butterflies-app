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
import BaseComponent from "./BaseComponent";

class Dashboard extends BaseComponent {
    network = undefined;
    editor = undefined;

    constructor() {
        super();
        this.state = {
            metaData: undefined,
            user: window.REACT_SERVER_PROPS.user,
            editMode: false,
            token: window.REACT_SERVER_PROPS.token
        };
        this.editorRef = React.createRef();
        this.network = new Network(this, window.REACT_SERVER_PROPS.token);
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({hasError: true});
        // You can also log the error to an error reporting service
        console.error("Error: " + error + " (info)");
    }

    componentDidMount() {
        this.getUserData();
    }

    getUserData() {
        var that = this;
        let metaCallback = function (metaData) {
            console.debug("meta data retrieved");
            console.debug(metaData);
            if (metaData === undefined) {
                console.error("MetaData could not be loaded!");
            } else {
                that.setState({metaData: metaData});
            }
            let callback = function (data) {
                console.debug(data);
                let userData = JSON.parse(data);
                console.debug("successfully retrieved user data with [" + userData.projects.length + "] projects");
                that.setState({user: userData, status: data.status, success: true, loading: false, userData: userData});
                console.debug(that.state.metaData);
            }
            that.network.callApi("/api/me", undefined, undefined, "POST", callback);
        }
        /* TODO:
            find out why a 302 redirect occurs if we do not send the authentication token explicitly with this GET request.
            is it because the authentication headers are not sent with GET requests?
        */
        this.network.callApi("/api/meta/user,file,project?token=" + this.state.token, undefined, undefined, "GET", metaCallback);
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
        this.network.callApi("/api/" + entity, data, undefined, "POST", callback);
    }
    editProfile() {
        console.debug("edit user profile");
        this.editorRef.current.setEntity("user", this.state.userData.id, ["id", "projects", "createdAt", "files", "email"]);
        if (this.editorRef.current.state.data === this.state.userData) {
            this.editorRef.current.toggle();
        } else {
            this.editorRef.current.handleOpen();
            this.editorRef.current.setData(this.state.userData, this.state.metaData["user"]);
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
            this.network.callApi("/api/" + action.entity + "/" + data.id, undefined, undefined, "DELETE", callback);
        }
        if (action.name === "edit") {
            this.editorRef.current.setEntity(action.entity,data.id, ["id", "createdAt"]);
            if (this.editorRef.current.state.data === data) {
                this.editorRef.current.toggle();
            } else {
                this.editorRef.current.handleOpen();
                this.editorRef.current.setData(data, this.state.metaData[action.entity]);
            }
            //data.description += " edited";
            //this.network.callApi("project/"+data.id, data, "PUT", callback);
        }
        console.debug(action.name + " " + action.entity + " #" + data.id);
    }

    submitChanges(data, files, entity, id) {
        console.debug("submitting changes for entity " + entity + " #" + id + "...");
        console.debug("files: " + files);
        console.debug(data);
        let that = this;
        let callback = function (data) {
            console.debug("data has been successfully persisted. response:");
            console.debug(data);
            that.editorRef.current.handleClose();
            that.getUserData();
        }
        let errorCallback = function (error) {
            console.error("an error has occurred while trying to persist data");
            that.setState({status: error.response.status});
            console.error(error.response);
        }
        let headers = {
            'Authorization': `Bearer ${this.state.token}`,
            'accept': `application/json`,
            'Content-Type': "multipart/form-data"
        }
        let formData = new FormData();
        for (let key in data) {
            formData.append(key, data[key]);
        }
        console.debug("attaching files...");
        for (let key in files) {
            for (let i = 0; i < files[key].length; i++) {
                var f = files[key][i];
                var file = files[key][i];
                console.debug("attaching file #" + i + " " + file.name + " for " + key);
                formData.append(key, file, file.name);
            }
        }
        console.debug("submitting form data");
        for (var key of formData.keys()) {
            console.log(key + "=" + formData.get(key));
        }
        this.network.callApi("/api/" + entity + "/" + id, formData, headers, "PUT", callback, errorCallback);
    }

    filter(obj, keys) {
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
        if (!this.state.user || this.state.status === 401) {
            window.location.href = "/redirect?to=/login&message=your session has expired.";
        }
        let callbacks = this.editEntity.bind(this);
        this.title = "Welcome " + this.state.user.name;
        const loading = this.state.loading;

        let user = this.filter(this.state.user, ["id", "name", "email", "company", "position", "bio", "tags", "image"]);

        return(
            <Paper>
                <Table>
                    <TableHead className={"big-header"}>
                        <TableRow key={"heading-dashboard"}>
                            <TableCell className={"profilePic"}>
                                {loading || this.state.userData === undefined ? (
                                    <img alt="placeholder" src={"/build/assets/images/userprofile-placeholder.jpg"}/>
                                ) : (
                                    <img alt={this.state.userData.name} src={this.state.userData.image}/>
                                )
                                }
                            </TableCell>
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
                                "alternateRows",
                                1
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
                                "alternateRows",
                                1
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