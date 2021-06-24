import NestedList from "./NestedList";
import axios from "axios";

class Network {
    token = undefined;
    caller = undefined;
    constructor(caller = undefined, token = undefined) {
        this.state = {
            loading: false,
            data: false,
            hasError: false,
            status: undefined
        };
        this.setCaller(caller);
        this.setToken(token);
    }
    setCaller(caller = undefined) {
        this.caller = caller;
    }
    setToken(token = undefined) {
        this.token = token;
    }
    setState(state = undefined) {
        console.debug("setting network" + (this.caller ? ' (and caller ' + typeof this.caller + ")" : '') + " state...");
        console.debug(state);
        this.state = state;
        if (this.caller && this.caller.setState) {
            this.caller.setState(state);
        }
    }

    callApi(target, data = undefined, headers = undefined, method = "GET", callback = null, errorCallback = null) {
        this.state.loading = true;
        method = method.toLowerCase();
        let uri = target;
        console.debug("trigger " + method + " request to API (" + uri + ") with token " + this.token + ". headers:");
        if (headers === undefined) {
            headers = {
                'Authorization': `Bearer ${this.token}`,
                'accept': `application/json`
            };
        }
        console.debug(headers);
        if (data !== undefined) console.debug(data);
        if (method === 'get' && data !== undefined && data.params === undefined) {
            data = {params: data};
        }
        axios[method](
            uri,
            data,
            headers
        ).then(result => {
            if (callback === null) {
                console.debug(result);
                this.setState({status: result.status, loading: false, payload: result.data});
            } else {
                callback(result.data);
            }
        }).catch(error => {
            let status = 500;
            if (errorCallback === null) {
                if (error.response) {
                    console.error("Request responded with an error ["+error.response.status+"].");
                    console.debug(error.response);
                    status = error.response.status;
                } else if (error.request) {
                    console.error("timeout")
                    console.debug(error.request);
                }
                console.error(error);
                this.setState({status: status, success: false, loading: false, hasError: true});
            } else {
                console.debug("an error occurred. trying to call custom errorCallback function.")
                errorCallback(error);
            }
        });

        return null;
    }

}

export default Network;