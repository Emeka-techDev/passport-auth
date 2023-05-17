const JwtStrategy = require('passport-jwt').Strategy;
const passport = require('passport');
const User = require('../models/User');
const ExtractJwt = require('passport-jwt').ExtractJwt;
require('dotenv').config();

passport.use(
    "jwt_strategy",
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.jwt_secret_key,
        },

        (payload, done) => {
            console.log(`payload ${payload}`);
            User.findById(payload.id)
                .then(user => {
                    if (user) {
                        return done(null, user);
                    
                    } else {
                        return(null, false);
                    }
                })
            .catch(err => {
                done(err, false);             
            })
        }
    )
)


passport.serializeUser((user, done)=> {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => { return done(null, user)})
        .catch(err => {
           return done(err, false);
        })
})