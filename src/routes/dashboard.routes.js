import { Router } from "express";

import { getChannelStats, gethanneVideo } from "../controller/dashboard.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router

router.use(verifyJWT)
router.route("/stats").get(getChannelStats)
router.route("/videos").get(gethanneVideo)

export default router;