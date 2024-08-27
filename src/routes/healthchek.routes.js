import { Router } from "express";
import { getHealthCheck, } from "../controller/healthchek.controller.js";


const router = Router()
router.route("/").get(getHealthCheck)

export default router