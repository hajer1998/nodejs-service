const config = require('../config/config');
const client = require('../modules/client');
const chatMessage = require('../models/ChatMessage');

exports.render_chat_form = function(req, res) {
    client.send_sync('hellolaravel', {
        route: "/api/user/"+req.params.id,
        method: "GET",
        headers: {
            Accept:"application/json",
            Authorization: "Bearer "+req.cookies.accessToken
        },
        query: null,
        body: null
    }, function (user, error) {
        if (error) {
            res.render('error', {
                error_message: error.message,
                error_status: error.status
            });
            return;
        }

        let criteria = {
                '$or': [
                    {'$and': [
                        {sender_id: req.logged_in_user_id},
                        {receiver_id: req.params.id}
                    ]},
                    {'$and': [
                        {sender_id: req.params.id},
                        {receiver_id: req.logged_in_user_id}
                    ]}
                ]
        };

        chatMessage.find(criteria, function(err, messages) {
            res.render('chat', {
                logged_in_user_id: req.logged_in_user_id,
                receiver: user,
                messages: messages
            });
        });
    });
}