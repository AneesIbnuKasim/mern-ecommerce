import express from 'express'
import { fetchMessages, fetchUsers } from '../controllers/chatController.js';

const chatRouter = express.Router();

chatRouter.get("/users", fetchUsers)

chatRouter.get('/:roomId', fetchMessages);

export default chatRouter;