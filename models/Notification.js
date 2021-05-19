const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: { type: String, default: '' },
    postId: {type: String, default: ''},
    ownerID: {type: String, default: ''}
},{
    timestamps: true
});
module.exports = mongoose.model('Notification', NotificationSchema)
