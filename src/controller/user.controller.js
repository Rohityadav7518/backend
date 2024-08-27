import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../../utils/cloudinary.js"
import { ApiResponse } from "../../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken(

            user.refreshToken = refreshToken,

            await user.save({ validateBeforeSave: false })

        )
        return { refreshToken, accessToken }

    } catch (error) {
        throw new ApiError(500, "failed to Generate RefreshToken or AcessToken")
    }
}


const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, email, password } = req.body

    if ([fullName, username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All field are required")
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(400, "User Already Exited")
    }

    const avatarLocalPath = req.file?.avatar[0]?.path
    let coverImageLocalPath;

    if (req.file && Array.isArray(req.file.coverImage) && req.file.coverImage.length > 0) {
        coverImageLocalPath = req.file.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avtar File Is Required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avtar File Is Required")
    }


    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("  -password -refreshToken ")
    if (!createdUser) {
        throw new ApiError(400, " Something Went Wrong While registering User")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Sucesssfully")
    )
})



const loginUser = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body

    if (!username && !email) {
        throw new ApiError(400, "Username And Passwoord is reuired")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new ApiError(400, "User Does Not Exists")
    }

    const isPasswordValid = await User.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(400, "Password is Incorrect")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken ")

    const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option).json(
            new ApiResponse(200, {
                user: loggedInUser, accessToken, refreshToken
            }, "User Logged In Successfully")
        )
})


const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id, {
        $sunset: {
            refreshToken: 1
        }
    }, {
        new: true
    }
    )

    const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", option)
        .cookie("refreshToken", option)
        .json(new ApiResponse(200, {}, "User Logged Out"))
})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(400, "Invalid Request")
    }
    try {

        const decodeToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodeToken?._id)
        if (!user) {
            throw new ApiError(400, "Invalid Refresh Token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(400, "Invalid Token Or EXpired")
        }
        const option = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        return res.status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("newRefershToken", newRefreshToken, option)
            .json(new ApiResponse(200, { "accessTokrn": newRefreshToken, accessToken }, "Access Token Refreshed"))
    } catch (error) {
        throw new ApiError(400, error?.massage || "Invalid Refresh Token")
    }
})


const chnageCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Incorrect Old Password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200)
        .json(new ApiResponse(200, {}, "Password Changed Successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    res.status(200)
        .json(new ApiResponse(200, req.user, "User Fetched Successfully"))
})


const updateAccountDetail = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body
    if (!fullName && !email) {
        throw new ApiError(400, "All Field Are Required")
    }

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            fullName,
            email: email
        }
    }, {
        new: true
    }).select("-password")

    return res.status(200)
        .json(new ApiResponse(200, user, "Account Detail Update Sucessfully"))

})



const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "No Avtar Image Is Missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar.url) {
        throw new ApiError(400, "Error while UpLoading ")
    }

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            avatar: avatar.url
        }
    }, { new: true }).select("-password")

    return res.status(200)
        .json(new ApiResponse(200, user, "Avtar Image Uploaded Successfully"))

})

//cover image update

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover Image Is Missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!coverImage.url) {
        throw new ApiError(400, "Cover File Uploading Error")
    }

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            coverImage: coverImage.url
        }
    }, { new: true }).select("-password")

    return res.status(200)
        .json(new ApiResponse(200, user, "Cover Image Updated Successfully"))

})



const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "No User Found")
    }
    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        }, {
            $lookup: {
                from: "subscriptions",
                localField: "_Id",
                foreignField: "channel",
                as: "subscriber"
            }
        }, {
            $lookup: {
                from: "subscriptions",
                localField: "_Id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        }, {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                }, channelSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                subscribedTo: {
                    $cond: {
                        $if: {
                            $in: [req.user?._id, "$subscribers.subscriber"]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        }, {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(400, "Channel Does not Exist")
    }
    return res.status(200)
        .json(new ApiResponse(200, channel, "User Channel Fetched Successfully"))

})

//watch history

const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([{
        $match: {
            _id: new mongoose.Types.ObjectId(req.user._id)
        }
    }, {
        $lookup: {
            from: "videos",
            localField: "watchHistory",
            foreignField: "_Id",
            as: "WatchHistory",
            pipeline: [
                {
                    $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_Id",
                        as: "owner",
                        pipeline: [
                            {
                                $project: {
                                    fullName: 1,
                                    avatar: 1,
                                    username: 1
                                }
                            }
                        ]
                    }
                }, {
                    $addFields: {
                        owner: {
                            $first: "$owner"
                        }
                    }
                }
            ]
        }
    }


    ])

    return res.status(200)
        .json(new ApiResponse(200, user[0].watchHistory, "Watch History Fetched Successfully"

        ))
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    chnageCurrentPassword,
    getCurrentUser,
    updateAccountDetail,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}

