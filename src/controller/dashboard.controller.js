import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.models.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { asyncHandler } from "../../utils/asyncHandler.js"

const getChannelState = asyncHandler(async (req, res) => {

})

const getChannelVideo = asyncHandler(async (req, res) => {

})

export {
    getChannelState, getChannelVideo
}