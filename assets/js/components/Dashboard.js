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
        this.state = { user: window.REACT_SERVER_PROPS.user, loading: true, token: window.REACT_SERVER_PROPS.token, data: false};
    }

    callApi(target, method = "GET", callback = null) {
        let uri="/api/"+target;
        console.log("trigger "+method+" request to API ("+uri+") with token "+this.state.token);
        axios.post(
            uri,
            {title: 'TestTest', description: 'description'},
            {headers: {'Authorization': `Bearer ${this.state.token}`}}
        ).then(result => {
            if (callback === null) {
                this.setState({ success: true, loading: false, payload: result.data});
                console.log(result.data);
            } else {
                callback(result.data, this);
            }
        })
        return null;
    }
    componentDidMount() {
        let callback = function(data, that) {
            console.log("callback yay!");
            that.setState({ success: true, loading: false, userData: JSON.parse(data)});
            console.log(data);
        }
        this.callApi("me", "GET", callback);
    }
    render() {
        if(!this.state.user) {
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
                <div><Button variant="contained" color="primary" onClick={this.callApi.bind(this,"project", "POST")}>create Project</Button></div>
                {loading ? (
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