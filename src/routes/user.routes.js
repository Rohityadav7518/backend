import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware"
import { getCurrentUser, getUserChannelProfile, getWatchHistory, updateAccountDetail, updateUserAvatar, updateUserCoverImage, chnageCurrentPassword, loginUser, logoutUser, refreshAccessToken, registerUser, } from "../controller/user.controller.js"
import { uplaod } from "../middleware/multer.middleware.js";


const router = Router
router.use(verifyJWT)

router.route("/register").post(uplaod.fields([{
    name: "avatar",
    maxCount: 1
}, {
    name: "coverImage",
    maxCount: 1
}]), registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/changePassword").post(verifyJWT, chnageCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetail)
router.route("/avatar").patch(uplaod.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(uplaod.single("cover-image"), updateUserCoverImage)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(getWatchHistory)

export default router;