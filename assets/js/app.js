/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import '../css/app.css';
import '../css/forms.css';
import '../css/colors.css';
import BootstrapNavbar from './components/BootstrapNavbar';
/*
import { createMuiTheme } from '@material-ui/styles';


const theme = createMuiTheme({
    palette: {
        primary: '#00bcd4',
        secondary: '#ff4081'
    }
});
*/
ReactDOM.render(<Router><BootstrapNavbar/></Router>, document.getElementById('root'));
