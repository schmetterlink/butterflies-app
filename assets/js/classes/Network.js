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
        console.debug("setting network"+(this.caller ? ' (and caller '+typeof this.caller+")" : '')+" state...");
        console.debug(state);
        this.state = state;
        if (this.caller && this.caller.setState) {
            this.caller.setState(state);
        }
    }
    callApi(target, data = undefined, method = "GET", callback = null, errorCallback = null) {
        this.state.loading = true;
        let uri="/api/"+target;
        console.debug("trigger "+method+" request to API ("+uri+") with token "+this.token);
        console.debug(data);
        axios[method.toLowerCase()](
            uri,
            data,
            {headers:
                    {
                        'Authorization': `Bearer ${this.token}`,
                        'accept': `application/json`
                    }
            }
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