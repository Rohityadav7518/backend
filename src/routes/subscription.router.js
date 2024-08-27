import { Router } from "express";
import { getChannelSuscribed, getChannelSuscriber, toggleSuscription } from "../controller/suscription.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()
router.use(verifyJWT)

router.route("/c/:channelId").get(getChannelSuscribed).post(toggleSuscription)

router.route("/u/:subscriberId").get(getChannelSuscriber)

export default router