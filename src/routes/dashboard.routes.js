import { Router } from "express";

import { getChannelState, getChannelVideo } from "../controller/dashboard.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

router.use(verifyJWT)
router.route("/stats").get(getChannelState)
router.route("/videos").get(getChannelVideo)

export default router;