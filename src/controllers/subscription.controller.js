import mongoose, { isValidObjectId } from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";

// Toggle Subscription Subscribe / Unsubscribe
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channelId");
    }

    const isSubscribed = await Subscription.findOne({
        subscriber: req.user?._id,
        channel: channelId,
    });

    if (isSubscribed) {
        await Subscription.findByIdAndDelete(isSubscribed?._id);

        return res
            .status(200)
            .json(
                new ApiResponse(200, { subscribed: false }, "unsunscribed successfully")
            );
    }

    await Subscription.create({
        subscriber: req.user?._id,
        channel: channelId,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, { subscribed: true }, "subscribed successfully")
        );
});

// Get subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    let { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channelId");
    }

    channelId = new mongoose.Types.ObjectId(channelId);

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: channelId,
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriber",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "subscribedToSubscriber",
                        },
                    },
                    {
                        $addFields: {
                            subscribedToSubscriber: {
                                $cond: {
                                    if: {
                                        $in: [channelId, "$subscribedToSubscriber.subscriber"],
                                    },
                                    then: true,
                                    else: false,
                                },
                            },
                            // subscribersCount: {
                            //     $size: "$subscribedToSubscriber",
                            // },
                            
                            subscribersCount: {
                                $size: {
                                    $ifNull: ["$subscribers", []]
                                }
                            },
                        },
                    },
                ],
            },
        },
        {
            $unwind: "$subscriber",
        },
        {
            $project: {
                _id: 0,
                subscriber: {
                    _id: "$subscriber._id",
                    username: "$subscriber.username",
                    fullName: "$subscriber.fullName",
                    avatar: "$subscriber.avatar",
                    subscribedToSubscriber: "$subscriber.subscribedToSubscriber",
                    subscribersCount: "$subscriber.subscribersCount",
                },
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(200, subscribers, "subscribers fetched successfully")
        );
});

// Get list of channels to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    const subscribedChannels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "subscribedChannel",
                pipeline: [
                    {
                        $lookup: {
                            from: "videos",
                            localField: "_id",
                            foreignField: "owner",
                            as: "videos",
                        },
                    },
                    {
                        $addFields: {
                            latestVideo: {
                                $last: "$videos",
                            },
                        },
                    },
                ],
            },
        },
        {
            $unwind: "$subscribedChannel",
        },
        {
            // $project: {
            //     _id: 0,
            //     subscribedChannel: {
            //         _id: 1,
            //         username: 1,
            //         fullName: 1,
            //         "avatar.url": 1,
            //         latestVideo: {
            //             _id: 1,
            //             "videoFile.url": 1,
            //             "thumbnail.url": 1,
            //             owner: 1,
            //             title: 1,
            //             description: 1,
            //             duration: 1,
            //             createdAt: 1,
            //             views: 1
            //         },
            //     },
            // },

            $project: {
                _id: 0,
                subscribedChannel: {
                    _id: "$subscribedChannel._id",
                    username: "$subscribedChannel.username",
                    fullName: "$subscribedChannel.fullName",
                    avatar: "$subscribedChannel.avatar",
                    latestVideo: "$subscribedChannel.latestVideo",
                },
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                subscribedChannels,
                "subscribed channels fetched successfully"
            )
        );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
