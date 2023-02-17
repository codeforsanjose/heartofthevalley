# HeartOfValley-Full-stack-React-app-with-Node.js-MySQL-and-Nginx-for-reverse-proxy

## Prerequisites
- Have [Node.js](Node.js) with version located in `.nvmrc`
- [Docker](https://www.docker.com/products/docker-desktop) (optional) installed on your system.
- A good understanding of using ReactJS.
- Understand how to create API services using the Node.js framework.
- (OPTIONAL) Prior knowledge on how to use Docker and Docker-compose to run and manage Docker containers.

## Setup Local Environment

### Install Dependencies 
Open Root folder of the app `cd heartofvalley/app` 

`Note:` This step is required once on project setup

Run `npm i` inside the client directory

Run `npm i` inside the server directory

## Run App without Docker
- Open client folder in one terminal `cd heartofvalley/app/client`
- Run `npm start`
- This will start frontend app on port `3000`
- Open server folder in another terminal `cd heartofvalley/app/server`
- Run `npm start`
- This will start nodejs server on port `3001`
- Keep both the terminals running.
- Access the app using route `http://localhost:3000/`.

## Run App with Docker
- Run `docker-compose up --build` inside the main project directory `/app`
- Access the app using route `http://localhost:3000/`.

## Directory Structure
- Root Folder of App: `heartofvalley/app`
- Backend NodeJS Code goes here: `heartofvalley/app/server`
- Frontend ReactJS Code goes here: `heartofvalley/app/client`

### Frontend React Structure
- `client/src/assets/stylesheets` - All custom CSS goes here
- `client/src/assets/images` - All images goes in here
- `client/src/components` - React components, stateless where possible
- `client/src/redux` - All redux reducers and action types are defined here
- `client/src/utils` - General code which isn't specific to your application  
- `client/src/App.js` - Root Component of the application  
- `client/src/index.js` - Initialize App here 
- `client/src/__tests__` - All unit tests go here

### Backend NodeJS Structure
- `__tests__` - All unit tests go here
- `database` - Database connection and helper functions
- `routes` - All routes go here
- `routes/feature_routes.js` - All routes for `/feature` API
- `data` - Any static data files
- `index.js` - App initialization code

## Scripts

### Frontend
-  `start`: To start the project on local development server

-  `build`: To create production build (`build` folder will be generated)

-  `test`: To run unit tests

-  `cover`: To run test and see coverage results.

-  `storybook`: To run storybook environment

-  `build-storybook`: To build stories

-  `lint`: To run eslint code checking

-  `validate`: To run prettier, eslint and unit tests with one command

-  `format`: To format the files based on ES6 standard

### Backend
-  `start`: To start the project on local development server

-  `test`: To run unit tests

-  `cover`: To run test and see coverage results.

-  `lint`: To run eslint code checking

-  `validate`: To run prettier, eslint and unit tests with one command

-  `format`: To format the files based on ES6 standard

#### UI development guide
- Add a component for your route in `src/components`
- Add tests for the component in `src/__tests__` with filename convention as `<Component-Name>.test.js`
- Add reducers and actions types for your component's view model in `src/redux/reducer` and `src/redux/actionTypes` if required
- Bask in the glory of your creation
- Don't forget to commit your changes and push to Bitbucket or GitHub!

#### Validate the code changes

- Run `npm run validate` to verify if everything is good.
- This will run 3 scripts internall using `npm-run-all` package.
	1. `format` -> This will formate the code as per ES6 Javascript standard.

	2. `eslint` -> This will run eslint in the `src` directory files and provide any static code issues.

	3. `test` -> This will run all tests and provide the results.

***Note:** Husky prehooks are configured so it will run the `validate` script when you try to commit and stop if any errors.*
  


## FAQs
    Let's keep this section for common problems we face and 
    also mention how we fixed it. This will help new people on 
    this project to get answers quickly.

#### How to install NodeJs on Chromebook?
[Link 1](https://medium.com/@jacoboakley/web-development-with-a-chromebook-installing-nodejs-4e358b82a31b) 
[Link 2](https://medium.com/@shovelend/guide-on-how-to-install-node-js-and-npm-on-a-chromebook-8d89a35b791a)  
You can try one of these.