/**
 * Module dependencies.
 */
var Notification = require ('../models/Notification');

exports.create = function(req, res) {

    const notification = new Notification({
        userId: '33',
        postId: '44'
    });

// Save Notification in the database

    notification.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Notification."
        });
    });
};


// Retrieve and return all notifications from the database.
exports.findAll = (req, res) => {
    let criteria = {ownerID: req.logged_in_user_id};

    Notification.find(criteria, function(err, notifications) {
        res.render('listNot', {
            notifications: notifications,
            logged_in_user_id: req.logged_in_user_id
        });
    });
};
