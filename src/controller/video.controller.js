import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../../utils/cloudinary.js"

const getAllVIdeo = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId, } = req.query

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})
const videoUpdate = asyncHandler(async (req, res) => {
    const { videoId, } = req.params
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

const togglePublishVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})


export {
    getAllVIdeo,
    publishAVideo, togglePublishVideo
    , deleteVideo, videoUpdate, getVideoById
}