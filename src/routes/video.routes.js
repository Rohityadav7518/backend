
import { verifyJWT } from "../middleware/auth.middleware.js"
import { getAllVIdeo, getVideoById, deleteVideo, videoUpdate, publishAVideo, togglePublishVideo, } from "../controller/video.controller.js"
import { uplaod } from "../middleware/multer.middleware.js";
import { Router } from "express";

const router = Router()

router.use(verifyJWT)
router.route("/").get(getAllVIdeo).post(uplaod.fields([
    {
        name: "videoFile",
        maxCount: 1
    }, {
        name: "thumbnail",
        maxCount: 1
    }
]), publishAVideo)

router.route("/:videoId").get(getVideoById).delete(deleteVideo).patch(uplaod.single("thumbnail"), videoUpdate)

router.route("/toogle/publish/:videoId").patch(togglePublishVideo)

export default router;