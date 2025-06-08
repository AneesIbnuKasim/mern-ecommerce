import messageModel from "../models/messageModel.js";

//load messages from db
const fetchMessages = async(req,res)=>{
    console.log('fetching messages');
    
        const roomId = req.params.roomId;
        messageModel.find({roomId:roomId})
        .then(messages=>{
            // console.log('message array:',messages);
            
            res.status(200).json(messages)
        })
        .catch(err=>{
            console.error("Error fetching Messages:", err);
      res.status(500).json({ error: "Message fetching failed" });
        })
}
const fetchUsers = (req, res) => {
  console.log("Fetching users...");

  messageModel
    .find({ toUserId: process.env.admin_id }) // get messages sent to admin
    .distinct("fromUserId") // get unique sender userIds
    .then(users => {
      console.log("Users fetched:", users);
      res.status(200).json(users);
    })
    .catch(err => {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "User fetching failed" });
    });
};

export {fetchMessages, fetchUsers }