import express from 'express'
import { fetchMessages, fetchUsers, deleteMessages } from '../controllers/chatController.js';

const chatRouter = express.Router();

chatRouter.get("/users", fetchUsers)

chatRouter.get('/:roomId', fetchMessages);

chatRouter.post('/deleteChat/:roomId', deleteMessages);

export default chatRouter;