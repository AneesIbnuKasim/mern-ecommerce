import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js";

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

// fetch matching users from db
const fetchUsers = async (req, res) => {
  try {
    const userIds = await messageModel.distinct("fromUserId", {
      toUserId: process.env.admin_id,
    });
    console.log('user ids in db',userIds);
    

    const users = await userModel.find(
      { _id: { $in: userIds } },
      { _id: 1, name: 1 }
    );
    console.log('users in Db', users);
    
    res.json({success:true, message:'Users fetched successfully',users});
  } catch (err) {
    console.error("Error fetching users:", err);
    res.json({ success:false, message: "User fetching failed" });
  }
};

// delete messages from specific room when chat closed
const deleteMessages = async(req,res)=>{
  try {
    const { roomId } = req.params
    await messageModel.deleteMany({roomId:roomId})
    res.json({success:true, message:`Messages cleared for ${roomId}`})
  } catch (error) {
    console.log(error);
    res.json({success:false, message:`Messages clear failed for ${roomId}`})
  }
}

export {fetchMessages, fetchUsers, deleteMessages }