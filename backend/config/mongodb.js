import mongoose from "mongoose";

const connectDB = async()=>{
    try {
    mongoose.connection.on('connected',()=>console.log(`MongoDB connected`)
    )
   await mongoose.connect(`${process.env.MONGODB_URI}/ecommerce`) }
   catch(err){
    console.log("Connection problem "+err);
    process.exit(1);
   }
}


export default connectDB