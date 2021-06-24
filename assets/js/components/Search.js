//Login Box
import React, {Component} from 'react';
import BaseComponent from "./BaseComponent";
import {Link} from 'react-router-dom';
import axios from 'axios';
import Button from "@material-ui/core/Button";
import Network from "../classes/Network";

class Search extends BaseComponent {
    network = undefined;

    constructor(props) {
        super(props);
        console.log(window.REACT_SERVER_PROPS);
        this.network = new Network(this, window.REACT_SERVER_PROPS.token);
        this.state = {
            user: window.REACT_SERVER_PROPS.user
        };
    }

    componentDidMount() {
        console.log(this.state);
    }

    submitSearch(e) {
        console.debug("start searching for " + this.state.searchterm);
        var callback = function (result) {
            console.debug("search result:");
            console.debug(result);
        }
        var errorCallback = function (error) {
            console.debug("an error occurred during search:");
            console.debug(error.response);
        }
        this.network.callApi('/api/search', this.state, undefined, 'GET', callback, errorCallback);
    }

    render() {
        return (
            <div className="inner-container">
                <div className="header">
                    <h2>Search</h2>
                    <div>
                        Please enter one or more search terms to find projects matching your skillset.
                    </div>
                </div>
                <div className="box">

                    <div className="input-group">
                        <label htmlFor="searchterm">Search for ...</label>
                        <input
                            type="text"
                            name="searchterm"
                            onChange={this.handleChange.bind(this)}
                            className="search-input"
                            placeholder="Search in projects for titles, descriptions, tags ..."/>
                    </div>

                    <Button
                        type="button"
                        className="search-btn"
                        variant="contained"
                        color="primary"
                        onClick={this
                            .submitSearch
                            .bind(this)}>Search</Button>

                    <Button
                        type="button"
                        className="reset-btn"
                        variant="contained"
                        color="secondary"
                        onClick={this
                            .resetData
                            .bind(this)}>Reset</Button>
                </div>
            </div>
        );
    }

}

export default Search;