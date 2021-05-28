const config = require('../config/config');
const client = require('../modules/client');

exports.render_chat_form = function(req, res) {
    res.render('chat', {
        logged_in_user_id: req.logged_in_user_id
    });
}