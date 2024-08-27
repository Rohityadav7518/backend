
import {
    addComment, getVideoComment,
    updateComment, deleteComment,
} from "../controller/comment.controller.js";
import { verifyJWT } from '../middleware/auth.middleware.js'
import { Router } from "express";


const router = Router()

router.use(verifyJWT)
router.route(":/videoId").get(getVideoComment).post(addComment)
router.route("/c:/commentId").delete(deleteComment).patch(updateComment)
export default router;