import express from "express";
const app = express()
import cookieParser from "cookie-parser";
import cors from "cors"

app.use(cors({
    origin: process.env.CORS_ORIGNE,
    credentials: true
}))

app.use(express.json({ limit: "160kb" }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser)

// for routes
import userRouter from './routes/user.routes.js'
import healthcheck from "./routes/healthchek.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscription from "./routes/subscription.router.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"


//routes decleration
app.use("/api/v1/healthcheck", healthcheck)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscription)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)



export default app