const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
require('../controllers/controller.auth');
require('dotenv').config();
const passport = require('passport');
const app = express();


let data ;

var cookieParser = require('cookie-parser');

app.use(cookieParser());

router.get('/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}));
const baseFrontendUrl = process.env.FRONTEND_URL;

router.get('/google/redirect', passport.authenticate('google', {
    failureRedirect: '/failedLogin',
    session: false
}),
    (req, res) => {
       
        console.log(`the request body is ${JSON.stringify(req.user)}`)
        const token = jwt.sign({user:{"email": req.user.email, "name": req.user.name}, id: req.user._id}, process.env.jwt_secret_key)
        // app.set('data', 'googleLogin')
        data = 'googleLogin'
        res.redirect(`${baseFrontendUrl}/OAuthRedirecting?token=${token}`);
    }
)

router.post('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect(`${baseFrontendUrl}`);
    });
});

router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/redirect', passport.authenticate('facebook', { failureRedirect: '/'}),
    function(req, res) {
        res.send(`welcome ${req.user.display}`);
    }

)



// // install cookie, facebook-token
// router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res, next) => {
//     console.log(`facebook auth is running`)
//     if (req.user)  {
//         const token = jwt.sign(user, process.env.jwt_secret_key)
//         req.cookies('jwt', token, {secure: true, httpOnly:true});
//         req.cookies('adm', req.user.admin, {secure:true});
//         req.cookies('user', `${req.user.firstName} ${req.user.lastName}`, {secure:true});
//         // res.status(200).send();
//         // app.set('data', 'facebookLogin')

//         data = 'facebookLogin'
//         res.redirect(`${baseFrontendUrl}/OAuthRedirecting?token=${token}`)
        
//     }
// })
module.exports = router;


// module.exports = {
//         router, 
//         data
// }