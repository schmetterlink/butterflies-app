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
        let change = {}
        change[e.target.name] = e.target.value
        this.setState(change)
    }

    resetData(event) {
        console.debug("resetting data fields");
        for (let key in this.state.originalData) {
            this.state.data[key] = this.state.originalData[key];
        }
        this.setState({data: this.state.data, originalData: {}});
    }
}

export default BaseComponent;