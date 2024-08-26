import { Router } from "express";
import { getChannelSuscribed, getChannelSuscriber, toggleSuscription } from "../controller/suscription.controller.js"
import { verfifyJWT } from "../middleware/auth.middleware.js"

const router = Router
router.use(verfifyJWT)

router.route("/c/:channelId").get(getChannelSuscribed).post(toggleSuscription)

router.route("/u/:subscriberId").get(getChannelSuscriber)

export default router