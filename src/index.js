import dotenv from "dotenv"
import connectDB from "../src/db/index.js";
import "./app.js"

dotenv.config({
    path: './.env'
})






connectDB().
    then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server Is Runing on ${PORT}`);
        })
    }).catch((error) => {
        console.log("Failed to Connect", error);

    })