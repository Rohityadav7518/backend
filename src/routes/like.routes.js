import { Router } from "express";
import { getLikedVideo, toggleCommentLike, toggleVideoLike, toogleTweetLike } from "../controller/like.controller.js"

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()
router.use(verifyJWT)

router.route("/toogle/v/:videos").post(toggleVideoLike)
router.route("/toogle/c/:commentId").post(toggleCommentLike)
router.route("/toogle/t/:tweetId").post(toogleTweetLike)
router.route("/videos").get(getLikedVideo)

export default router;