import mongoose  from "mongoose";
const messageSchema = new mongoose.Schema({
    messageId : {type: 'String', required: true},
    roomId: { type: String, required: true },
    fromUserId : {type: 'String', reuired: true},
    toUserId : {type: 'String', reuired: true},
    message : {type : 'String', required: true},
    timestamp : {type : Date, default: Date.now}
})
const messageModel = mongoose.models.message || mongoose.model('message',messageSchema);
export default messageModel