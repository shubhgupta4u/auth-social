# auth-social
A Node.js/Typescript module for web application that supports authentication with Google and Facebook and can be extended to other providers also.
## Installation 
```sh
npm install auth-social --save
yarn add auth-social
bower install auth-social --save
```
## Usage 
### TypeScript
#### Create 'AuthConfig' configutation object for AuthService, responsible for handling all authorization activity like sign-in or sign-out
```typescript
import {AuthService, FacebookLoginProvider, GoogleLoginProvider, AuthConfig } from 'auth-social';

private config:AuthConfig = new AuthConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider("<your-app-google-api-key>","<your-app-google-client_id>")
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider("<your-facebook-app_id>")
    }
  ]);

private authService:AuthService = new AuthService(config);
```
#### Perform user sign-in using Facebook
```typescript
import { AuthService, FacebookLoginProvider, User } from 'auth-social';

this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((user:User) => {
      console.log(user);
      //User login successfuly
}, (error:any)=>{
    //error occured while user sign-in 
});
```
#### Perform user sign-in using Google
```typescript
import { AuthService, GoogleLoginProvider, User } from 'auth-social';

this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user:User) => {
      console.log(user);
      //User login successfuly
}, (error:any)=>{
    //error occured while user sign-in  
});
```
#### Perform user sign-out
```typescript
import { AuthService } from 'auth-social';

this.authService.signOut().then(() => {
      //User log-off successfully
}, (error:any)=>{
    //error occured while user signout 
});
```
### Javascript
#### Create 'AuthConfig' configutation object for AuthService, responsible for handling all authorization activity like sign-in or sign-out
```javascript
var auth = require('auth-social');

var config = new auth.AuthConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new auth.GoogleLoginProvider("<your-app-google-api-key>","<your-app-google-client_id>")
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new auth.FacebookLoginProvider("<your-facebook-app_id>")
    }
  ]);

var authService = new auth.AuthService(config);
```
#### Perform user sign-in using Facebook
```javascript
var auth = require('auth-social');

authService.signIn(auth.FacebookLoginProvider.PROVIDER_ID).then((user) => {
      console.log(user);
      //User login successfuly
}, (error:any)=>{
    //error occured while user sign-in 
});
```
#### Perform user sign-in using Google
```javascript
var auth = require('auth-social');

authService.signIn(auth.GoogleLoginProvider.PROVIDER_ID).then((user) => {
      console.log(user);
      //User login successfuly
}, (error:any)=>{
    //error occured while user sign-in 
});
```
#### Perform user sign-out
```javascript
var auth = require('auth-social');

authService.signOut().then(() => {
      //User log-off successfully
}, (error:any)=>{
    //error occured while user signout 
});
```
### Support
```Bug or Suggestion Reporting
You can directly send any bug/issue or suggestion to my personal email id: shubhgupta4u@gmail.com.
```