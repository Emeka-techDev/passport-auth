const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const googleAuth = require("./routes/authentication");
const jwt = require('jsonwebtoken');


// const generalAuth = require('../routes/authentication')
// const googleAuth = generalAuth.router;
// const data = generalAuth.data;

require("./controllers/controller.tokenJWT");
require('dotenv').config();

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use('/auth', googleAuth);

const jwt_decode = require('jwt-decode');
let token;

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(x => {
        console.log(`connected to mongoDb server ${x.connections[0].name}`)
    })
    .catch( err => {
        console.error(`Error connecting to mongo db`, err)
    })

//why are we using app.route
app.get('/', (req, res) => {
    res.render('home');
})

app.get('/failedlogin', (req, res) => {
    res.send('login failed');
})

app.route('/getDetails', passport.authenticate('jwt_strategy', {
    session: false}), (req, res) => {
    console.log(`the user grom request details is ${req.user}`);
    
});

app.get('/OAuthRedirecting', (req, res) => {
    let encodedToken = req.query.token; 
    token = jwt_decode(encodedToken);
    
   
    // console.log(`data is ${data}`);

    // console.log(`the decode token is ${JSON.stringify(token)}`);  
    res.render('profile', {username: token.user.name, email: token.user.email, type: 'google' });
    

    // if (data == 'googleLogin') {
    //     console.log(`the decode token is ${JSON.stringify(token)}`);  
    //     res.render('profile', {username: token.user.name, email: token.user.email, type: 'google' });
    // }  
    // } else if (data == 'facebookLogin') {        
    //     res.render('profile', {username: token.user.name, email: token.user.email, type: 'facebook' });
    // }
    
})

app.post('/profile', function(req, res) {
        console.log(`profile is running`);
        console.log(`profile token is ${token}`)
        console.log(`user profile is ${token.user.email}`);
        res.send(token.user.email);
    }
);

app.listen(process.env.PORT || 3000, () => {
    console.log(`running on port ${process.env.PORT || 3000}`);
})