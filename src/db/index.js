import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";



const connectDB = async () => {
    try {
        const connectingInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`database connected successfully ${connectingInstance.connection.host}`)
    } catch (error) {
        console.log("failed while connecting database ", error);
        process.exit(1)

    }
}
export default connectDB