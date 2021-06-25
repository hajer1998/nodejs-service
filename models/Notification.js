const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    user: { type: Object, default: '' },
    postId: {type: String, default: ''},
    ownerID: {type: String, default: ''}
},{
    timestamps: true
});
module.exports = mongoose.model('Notification', NotificationSchema)
