import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { asyncHandler } from "../../utils/asyncHandler.js"

const getVideoComment = asyncHandler(async (req, res) => {
    const { videoId } = req.param
    const { page = 1, limit = 10 } = req.query

})

const addComment = asyncHandler(async (req, res) => {

})

const updateComment = asyncHandler(async (req, res) => {

})

const deleteComment = asyncHandler(async (req, res) => {

})

export { addComment, updateComment, deleteComment, getVideoComment }