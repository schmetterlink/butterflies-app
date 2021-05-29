import React, {Component, useState} from 'react';
import Login from './Login';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import NestedList from '../classes/NestedList';

class Dashboard extends Component {

    constructor() {
        super();
        this.state = { users: [], loading: true, token: false, data: false};
        this.grantAccess = this.grantAccess.bind(this);
        this.title = "Please log in"
    }

    grantAccess(payload) {
        console.log(payload);
        if (payload.token) {
            console.log("setting token "+payload.token);
            this.title = "Welcome " + payload.payload.name;
            this.setState({token: payload.token, data: payload, loading: false});
        }
    }

    render() {
        console.log("rendering");
        const loading = this.state.loading;
        const token = this.state.token;
        if(!token) {
            return <Login grantAccess={this.grantAccess} />
        }
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
                {loading ? (
                    <div className={'row text-center'}>
                        <span className="fa fa-spin fa-spinner fa-4x"> </span>
                    </div>
                ) : (
                    <div>{ new NestedList().renderData("data", this.state.data.payload) }</div>
                )}
            </Paper>
        )
    }
}
export default Dashboard;