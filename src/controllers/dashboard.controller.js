import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Get channel stats (total subscribers, total views, total videos, total likes)
const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const channelObjectId = new mongoose.Types.ObjectId(userId);

    const [totalSubscribers, videoStats, likeStats] = await Promise.all([
        Subscription.countDocuments({ channel: channelObjectId }),
        Video.aggregate([
            {
                $match: {
                    owner: channelObjectId
                }
            },
            {
                $group: {
                    _id: null,
                    totalViews: {
                        $sum: "$views"
                    },
                    totalVideos: {
                        $sum: 1
                    }
                }
            }
        ]),
        Like.aggregate([
            {
                $lookup: {
                    from: "videos",
                    localField: "video",
                    foreignField: "_id",
                    as: "videoDetails"
                }
            },
            {
                $unwind: "$videoDetails"
            },
            {
                $match: {
                    "videoDetails.owner": channelObjectId
                }
            },
            {
                $count: "totalLikes"
            }
        ])
    ]);

    const channelStats = {
        totalSubscribers,
        totalLikes: likeStats[0]?.totalLikes || 0,
        totalViews: videoStats[0]?.totalViews || 0,
        totalVideos: videoStats[0]?.totalVideos || 0
    };

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                channelStats,
                "channel stats fetched successfully"
            )
        );
});

// Get channel videos with pagination and sorting
const getChannelVideos = asyncHandler(async (req, res) => {

    const userId = req.user?._id;

    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $addFields: {
                createdAt: {
                    $dateToParts: { date: "$createdAt" }
                },
                likesCount: {
                    $size: "$likes"
                }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                _id: 1,
                "videoFile.url": 1,
                "thumbnail.url": 1,
                title: 1,
                description: 1,
                createdAt: {
                    year: 1,
                    month: 1,
                    day: 1
                },
                isPublished: 1,
                likesCount: 1
            }
        }
    ]);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            videos,
            "channel stats fetched successfully"
        )
    );
});

export { getChannelStats, getChannelVideos };
