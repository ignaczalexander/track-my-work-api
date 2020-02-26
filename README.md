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
`/api/users/login` | `POST` | [Login a user](#login-a-user)
`/api/users/confirm/:token` | `GET` | [Confirm the registration](#confirm-the-registration)
`/api/users/password` | `PUT` | [Change the password](#change-the-password)
`/api/period` | `GET` | [Get all periods for the user](#get-periods)
`/api/period/:id` | `GET` | [Get a period by id](#get-a-period-by-id)
`/api/period` | `POST` | [Create a period for the user](#create-a-period-for-the-user)
`/api/period/:id` | `DELETE` | [Delete a period by id](#delete-a-period-by-id)
`/api/shift/:period_id` | `POST` | [Create a shift for a period](#create-a-shift-for-a-period)
`/api/shift/:period_id/:shift_id` | `DELETE` | [Delete a shift from a period](#delete-a-shift-from-a-period)

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
    
**Login a user**
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
    
**Confirm the registration**
----
 Evaluates the supplied token and cofirms the registration for the user
 
* **URL**

  `/api/users/confirm/:token`

* **Method:**

  `GET`
  
*  **URL Params**

    token=[string] <br/>

* **Data Params**

    *none*

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ message: 'The account has been verified. Please log in.' }`
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** Errors

  OR
  
  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** Errors
    
**Change the password**
----
 Changes the password for the user.
 
* **URL**

  `/api/users/password`

* **Method:**

  `PUT`
  
*  **URL Params**

    *none*

* **Data Params**

  password=[string] <br/>
  password2=[string] <br/>


* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ success: true, token: jwtToken }`
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** Errors

  OR
  
  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ usernotfound: 'User not found' }`
    
  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ msg: 'Not authenticated!' }`

**Get periods**
----
 Gets all the periods for the user.
 
* **URL**

  `/api/period`

* **Method:**

  `GET`
  
*  **URL Params**

    *none*

* **Data Params**

    *none*

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** List of periods
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** Errors

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ msg: 'Not authenticated!' }`
    
**Get a period by id**
----
 Gets a period by id for the user.
 
* **URL**

  `/api/period/:id`

* **Method:**

  `GET`
  
*  **URL Params**

    id=[string]

* **Data Params**

  *none*

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** A period
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ periodnotfound: 'Period not found with id' }`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ msg: 'Not authenticated!' }`
    
**Create a period for the user**
----
 Creates a period with the specified data for the user.
 
* **URL**

  `/api/period`

* **Method:**

  `POST`
  
*  **URL Params**

    *none*

* **Data Params**

  start_date=[Date] <br/>
  end_date=[Date]

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** The created period
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** Errors

  OR
  
  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ periodnotfound: 'Period not found with id' }`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ msg: 'Not authenticated!' }`
    
**Delete a period by id**
----
 Deletes a period using the specified id for the user.
 
* **URL**

  `/api/period/:id`

* **Method:**

  `DELETE`
  
*  **URL Params**

   id=[String]

* **Data Params**

  *none*

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ success: true, msg: 'Period deleted' }`
    
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ periodnotfound: 'Period not found with id' }`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ msg: 'Not authenticated!' }`

**Create a shift for a period**
----
 Creates a shift for the specified period for the user.
 
* **URL**

  `/api/shift/:period_id`

* **Method:**

  `POST`
  
*  **URL Params**

    period_id=[String]

* **Data Params**

    start_date=[Date] <br/>
    end_date=[Date] <br/>

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** The update period containing the shift
    
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** Errors

  OR

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ periodnotfound: 'Period not found with id' }`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ msg: 'Not authenticated!' }`
    
**Delete a shift from a period**
----
 Deletes a shift from the specified period for the user.
 
* **URL**

  `/api/shift/:period_id/:shift_id`

* **Method:**

  `DELETE`
  
*  **URL Params**

    period_id=[String]<br/>
    shift_id=[String]

* **Data Params**

    *none*

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ success: true }`
    
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** Error

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ msg: 'Not authenticated!' }`    
