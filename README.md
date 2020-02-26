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
`/ap/users/register` | `POST` | [Register a new user](#register-a-new-user)
`/api/users/login` | `POST` | Login the user
`/api/users/confirm/:token` | `GET` | Confirm the registration
`/api/users/password` | `PUT` | Change password
`/api/period` | `GET` | Get all periods for the user
`/api/period/:id` | `GET` | Get a period by id
`/api/period` | `POST` | Create a period for the user
`/api/period/:id` | `DELETE` | Delete a period by id
`/api/shift/:period_id` | `POST` | Create a shift for a period
`/api/shift/:period_id/:shift_id` | `DELETE` | Delete a shift from a period

**Register a new user**
----
 Creates a new user and sends a verification email to the specified email address.
 
* **URL**

  `/api/users/register`

* **Method:**

  `POST`
  
*  **URL Params**

   *none*

* **Data Params**

  name=[string] <br/>
  email=[string] <br/>
  password=[string] <br/>
  password2=[string] <br/>

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ message: 'A verification mail has been sent.' }`
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** Errors

  OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** `{ message: `Impossible to send email to ${user.email}` }`
    
**Login using email and password**
----
 Evaluates the supplied email and password and returns a JWT token.
 
* **URL**

  `/api/users/login`

* **Method:**

  `POST`
  
*  **URL Params**

   *none*

* **Data Params**

  email=[string] <br/>
  password=[string] <br/>

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ success: true, token: jwtToken }`
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** Errors

  OR
  
   * **Code:** 404 NOT FOUND <br />
    **Content:** Errors

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ notverified: 'Your account has not been verified.' }`
