import React, {Component} from 'react';
import Network from "../classes/Network";

class BaseComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: undefined
        };
    }

    componentDidUpdate() {
        var x = document.getElementsByClassName("tags");
        for (var i = 0; i < x.length; i++) {
            x[i].querySelectorAll('ul.taglist').forEach(n => n.remove());
            x[i].innerHTML += this.showTags(x[i].innerHTML);
        }
        console.log("rendering finished");
    }

    showTags(tags) {
        let items = '';
        let taglist = tags.split(",");
        for (var i = 0; i < taglist.length; i++) {
            items += taglist[i].trim() ? "<li>" + taglist[i].trim() + "</li>" : "";
        }
        return "<ul class='taglist'>" + items + "</ul>";
    }

    handleChange(e) {
        if (event.target.files) {
            console.debug("a file has been selected for upload to field '" + e.target.name + "':");
            console.debug(event.target.files);
            this.state.files[e.target.name] = event.target.files;
        }
        this.state.data[e.target.name] = e.target.value;
    }

    resetInputs(e) {
        Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = "")
        );
        this.setState({
            itemvalues: [{}]
        });
    }
}

export default BaseComponent;