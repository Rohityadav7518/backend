
import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { asyncHandler } from "../../utils/asyncHandler.js"


const toggleSuscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
})

const getChannelSuscriber = asyncHandler(async (req, res) => {
    const { channelId } = req.params
})

const getChannelSuscribed = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export { getChannelSuscribed, getChannelSuscriber, toggleSuscription }