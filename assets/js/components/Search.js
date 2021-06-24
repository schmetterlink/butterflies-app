//Login Box
import React, {Component} from 'react';
import BaseComponent from "./BaseComponent";
import {Link} from 'react-router-dom';
import axios from 'axios';
import Button from "@material-ui/core/Button";
import Network from "../classes/Network";
import NestedList from "../classes/NestedList";

class Search extends BaseComponent {
    network = undefined;

    constructor(props) {
        super(props);
        console.log(window.REACT_SERVER_PROPS);
        this.network = new Network(this, window.REACT_SERVER_PROPS.token);
        this.state = {
            data: {},
            originalData: {},
            loading: false,
            user: window.REACT_SERVER_PROPS.user
        };
    }

    componentDidMount() {
        console.log(this.state);
    }

    submitSearch(e) {
        let that = this;
        this.setState({loading: true});
        console.debug(this.state);
        console.debug("start searching for " + this.state.data.searchterm);
        var callback = function (result) {
            console.debug("search results:");
            console.debug(result);
            let results = JSON.parse(result);
            that.setState({loading: false, searchResults: results});
        }
        var errorCallback = function (error) {
            that.setState({loading: false, error: error.response});
            console.debug(error);
        }
        this.network.callApi('/api/search', {searchterm: this.state.data.searchterm}, undefined, 'GET', callback, errorCallback);
    }

    showEntry(data, action, event) {
        console.debug(action + " entry");
        console.debug(data);
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
                {this.state.loading ? (
                    <div className={'row text-center'}>
                        <span className="fa fa-spin fa-spinner fa-4x"></span>
                    </div>
                ) : (<span> </span>)}
                {this.state.searchResults !== undefined &&
                new NestedList(
                    [
                        {name: "show", class: "primary", callback: this.showEntry.bind(this), entity: "project"},
                    ])
                    .renderData(
                        "results",
                        {"Search Results": this.state.searchResults},
                        "alternateRows",
                        1
                    )
                }

            </div>
        );
    }

}

export default Search;