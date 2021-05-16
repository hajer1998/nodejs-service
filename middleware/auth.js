var jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
        if(req.cookies.accessToken){
            var decoded = jwt.verify(req.cookies.accessToken, 'hajer_secret');
            req.logged_in_user_id = decoded.user_id;
            next();
        } else {
         res.redirect('/');
        }
    } catch(error) {
        res.render('error', {
            error_message:error.message,
            error_status:500
        });
    }
};
