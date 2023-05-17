const express = require('express');
const passport = require('passport');
const router = express.Router();
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config();
const User = require('../models/User');
const FacebookStrategy = require('passport-facebook');
require('./controller.tokenJWT');
let jwt = require('jsonwebtoken');
let facebookTokenStategy = require('passport-facebook-token');

const googleAuth = require('../routes/authentication');


const passportConfig = {
    "clientID": process.env.GOOGLE_CLIENT_ID,
    "clientSecret": process.env.GOOGLE_CLIENT_SECRET,
    "callbackURL": "http://localhost:3000/auth/google/redirect",
    "passReqToCallback": true
}

passport.use(User.createStrategy());

passport.use(
    new GoogleStrategy(
        passportConfig, 
        (request, accessToken, refreshToken, profile, done) => {
            console.log(`google profile is ${JSON.stringify(profile)}`)
            User.findOrCreate(
                {email: profile._json.email},
                {name: profile.displayName, email: profile._json.email},
                (err, user) => {
                    return done(err, user)
                }
            );
        }
    )
)

//seconf passport facebook auth config
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/redirect",
    profileFields: ['id', 'displayName', 'photos', 'email']

}, (accessToken, refreshToken, profile, done) => {
    console.log(`facebook profile is ${JSON.stringify(profile)}`)
   
    User.findOrCreate({ facebookId: profile.id }, {name: profile.displayName}, (err, user) => {
        done(err, user);
    });
})) 


passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(user, done){
    done(null, user);
});

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// why are we exporting router when we didnt use it
module.exports = router