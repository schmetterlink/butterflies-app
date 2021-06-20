#!/usr/bin/env bash
sudo apt-get update
sudo apt-get -y install npm
npm install -g n
sudo n stable
sudo apt-get --assume-yes install curl

curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt-get update
sudo apt-get -y install yarn
yarn install

yarn add --dev react react-dom prop-types axios jquery popper.js font-awesome sass-loader@^7.0.1 @babel/preset-react dropzone sortablejs @babel/plugin-transform-runtime
yarn add bootstrap @babel/core@^7.0 core-js@2 babel-loader @babel/preset-env @babel/plugin-proposal-class-properties @babel/plugin-transform-runtime @babel/plugin-syntax-dynamic-import react-router-dom @material-ui/core @babel/runtime
yarn add formik yup @emotion/styled @emotion/react babel-polyfill react-bootstrap

## sass is supposed to deliver better results than node-sass
yarn add node-sass@^4.1.1 --devs
# however, yarn complains without node-sass
# so at a later stage, try to use sass instead of node-sass
# yarn add sass --dev

composer update
composer install

yarn build
yarn encore dev
#composer create-project symfony/website-skeleton .
