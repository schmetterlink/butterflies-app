//Logout
import React, {Component} from 'react';
import axios from 'axios';

class Logout extends Component {

    constructor(props) {
        super(props);
        this.state = { data: false, loading: true }
    }
    componentDidMount() {
        this.logoutUser();
    }

    componentWillUnmount() {
        /*
        / overwrite setState-method to avoid state updates on unmounted components
        / as suggested here: https://stackoverflow.com/a/61055910/8800495
        */
        this.setState = (state,callback)=>{
            return null;
        };
    }

    logoutUser() {
        axios.get(`/auth/logout`).then(payload => {
            console.log(payload);
            //this.setState({data: payload, loading: false})
            setTimeout(function () {
                window.location.href = '/dashboard'
            }, 3000);
        })
    }

    render() {
        return (
            <div>
                <section className="row-section">
                    <div className="container">
                        <div className="row">
                            <h2 className="text-center"><span>Logging out</span></h2>
                        </div>

                        <div>
                            <p>
                                You have been successfully signed off your account and will be redirected
                                homewards in 3 seconds. We hope to see you again soon. Bye!
                            </p>
                            <div className={'row text-center'}>
                                <span className="fa fa-spin fa-spinner fa-4x"></span>
                            </div>
                        </div>


                    </div>
                </section>
            </div>
        );
    }

}

export default Logout;