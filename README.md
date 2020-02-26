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

## Endpoint summary
The full description of the API endpoints can be found on the Wiki.

Route | Method | Description
------------ | ------------- | ------------
`/ap/users/register` | `POST` | Register a new user
`/api/users/login` | `POST` | Login the user
`/api/users/confirm/:token` | `GET` | Confirm the registration
`/api/users/password` | `PUT` | Change password
`/api/period` | `GET` | Get all periods for the user
`/api/period/:id` | `GET` | Get a period by id
`/api/period` | `POST` | Create a period for the user
`/api/period/:id` | `DELETE` | Delete a period by id
`/api/shift/:period_id` | `POST` | Create a shift for a period
`/api/shift/:period_id/:shift_id` | `DELETE` | Delete a shift from a period
