import React, {Component} from 'react';
import Network from "../classes/Network";

class BaseComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: undefined,
            originalData: {}
        };
    }

    handleChange(e) {
        if (this.state.originalData[e.target.name] === undefined) {
            this.state.originalData[e.target.name] = this.state.data[e.target.name];
        }
        if (event.target.files) {
            console.debug("a file has been selected for upload to field '" + e.target.name + "':");
            console.debug(event.target.files);
            this.state.files[e.target.name] = event.target.files;
        }
        this.state.data[e.target.name] = e.target.value;
    }

    resetData(event) {
        console.debug("resetting data fields");
        console.debug(this.state);
        for (let key in this.state.originalData) {
            this.state.data[key] = this.state.originalData[key];
        }
        this.setState({data: this.state.data, originalData: {}});
    }
}

export default BaseComponent;