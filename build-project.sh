#!/usr/bin/env bash
sudo apt-get update
sudo apt-get install npm
npm install -g n
sudo n stable
sudo apt-get --assume-yes install curl

curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt-get update
sudo apt-get install yarn
yarn install
yarn encore dev

yarn add jquery --dev
yarn add bootstrap
yarn add popper.js --dev
yarn add font-awesome --dev
yarn add sass-loader@^7.0.1 --dev

## sass is supposed to deliver better results than node-sass
yarn add node-sass@^4.1.1 --dev
# however, yarn complains without node-sass
# so at a later stage, try to use sass instead of node-sass
# yarn add sass --dev

yarn add @babel/core@^7.0
yarn add @babel/preset-react --dev
yarn add react-router-dom
yarn add --dev react react-dom prop-types axios
yarn add @babel/plugin-proposal-class-properties @babel/plugin-transform-runtime @babel/plugin-syntax-dynamic-import
yarn add babel-loader @babel/preset-env

yarn add core-js@2

yarn add dropzone sortablejs --dev

composer update
composer install

yarn build
#composer create-project symfony/website-skeleton .
