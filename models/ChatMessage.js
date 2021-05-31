// Map once chat message to collection in DB

const  mongoose  = require("mongoose");
const  chatMessageSchema  =  new mongoose.Schema(
    {
        message: {type: String},
        sender_id: {type: String},
        receiver_id: {type: String},
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('ChatMessage', chatMessageSchema)