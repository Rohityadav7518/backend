import { Router } from "express";

import {
    getPlaylistById, getUserPlaylists, updatePlaylist, addVideoToPlaylist
    , createPlaylist, deletePlaylist, removeVideoFromPlaylist
} from '../controller/play.controller.js'

import { verifyJWT } from "../middleware/auth.middleware.js"
const router = Router

router.use(verifyJWT)
router.route("/").post(createPlaylist)

router.route("/:playlistId").get(getPlaylistById).patch(updatePlaylist).delete(deletePlaylist)
router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist)

router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist)
router.route("/user/:userId").get(getUserPlaylists)

export default router;
