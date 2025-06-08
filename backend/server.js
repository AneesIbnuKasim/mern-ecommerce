import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import productRouter from "./routes/productRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import  http  from 'http'
import setupSocket from "./config/socket.js"
import chatRouter from "./routes/chatRoute.js";

//app config
const app = express()
export const server = http.createServer(app)
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

//call-socketio
setupSocket(server)

//middlewares
app.use(express.json())
app.use(cors())


//api endpoints

// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
//   next();
// });

app.use('/api/user',userRouter);

// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
//   next();
// });

app.use('/api/product',productRouter);

// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
//   next();
// });


app.use('/api/cart',cartRouter);

// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
//   next();
// });

app.use('/api/order',orderRouter)

// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
//   next();
// });

app.use('/api/messages', chatRouter);

app.get('/',(req,res)=>{
    res.send("API working")
})

server.listen(port,()=>console.log(`Server running at ${port}`)
)