# TrackMyWork API

This is a Node.js REST API that is used by the [TrackMyWork](https://github.com/ignaczalexander/track-my-work-react) React application.

## Technologies used
* Node.js
* Express
* JWT authentication
* MongoDB noSQL database
* Mongoose MongoDB object modeling

## How to run it locally
1. Run `npm install` in the project directory
2. Create a `keys_dev.js` file inside the *config* folder
3. Export your MongoDB connection string and your JWT secret with the following structure:</br>
  ```javascript
  module.exports = {
  mongoURI: 'yourConnectionString',
  secretOrKey: 'yourSecret',
};
```
4. Run `npm start` to run the server in development mode
5. You can connect to the server on https://localhost:5000
