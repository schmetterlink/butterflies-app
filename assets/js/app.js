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
import '../css/styles.css';
import '../css/styles-custom.css';
import Home from './components/Home';


ReactDOM.render(<Router><Home/></Router>, document.getElementById('root'));
