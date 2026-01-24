/* eslint-disable @typescript-eslint/no-explicit-any */
import { BellRing, Bookmark, Edit2, Heart, Loader, MoreVertical } from "lucide-react";
import { useUser } from "../context/userContext";
import type { TweetCardProps } from "../types";
import { formatShortTime } from "../utils/timeShortFormater";
import { useTweetsContext } from "../context/TweetsContext";

const TweetCard: React.FC<TweetCardProps> = ({ tweet, onOpen, handleSubscribe, subscribeLoaderId, subscribeDetails }) => {
    const owner = Array.isArray(tweet?.owner) ? tweet?.owner[0] : tweet?.owner;
    const { user } = useUser();
    const { handleTweetLike, likeLoadingId, handleSaveTweet, saveTweetLoadingId } = useTweetsContext();

    // subscribe logic for frontend
    const channelId = tweet?.owner?._id;
    let isSubscribed = false
    if (channelId) {
        isSubscribed =
            subscribeDetails[channelId]?.isSubscribed ?? tweet?.isSubscribed;
    }

    return (
        <div className='border border-neutral-300 shadow-lg w-full p-2 rounded-lg'>
            <div className='flex items-center justify-between gap-2 mb-2'>
                <div className="flex items-center gap-2">
                    <img src={owner?.avatar?.url} alt="user-avatar" className='w-9 rounded-full' />
                    <div className=""><p className='text-neutral-700 font-medium'>{owner?.username?.slice(0, 20)}{owner?.username && owner.username.length > 20 ? "..." : ""}</p>
                        <p className="text-[11px] text-neutral-600 -mt-1">{tweet?.isEdited ? <span className="flex items-center gap-[2px]"><Edit2 size={10} /> Edited</span> : ""}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        disabled={subscribeLoaderId === channelId}
                        onClick={() => tweet.owner?._id && handleSubscribe(tweet.owner?._id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold text-red-700 bg-red-50 cursor-pointer 
  ${user?._id === tweet?.owner?._id ? "hidden" : "flex"}`}
                    >
                        {subscribeLoaderId === tweet?.owner?._id ? (
                            <Loader size={16} className="animate-spin" />
                        ) : isSubscribed ? (
                            <BellRing size={16} />
                        ) : (
                            "Subscribe"
                        )}
                    </button>

                    <MoreVertical size={18} className="text-neutral-600" />
                </div>
            </div>
            <p className="text-xs mb-3 text-neutral-600">{tweet?.content && tweet.content.length > 30 ? tweet.content.slice(0, 30) + "..." : tweet?.content}</p>
            <div
                onClick={() => tweet && onOpen(tweet)}
                className="w-full h-32">
                <img src={tweet?.tweetImage?.url} alt="tweet-images" className="rounded-sm h-full w-full bg-center object-cover cursor-pointer" />
            </div>

            <div className="flex items-center justify-between mt-3 w-full">
                <div className="flex items-center gap-2">
                    <button
                        disabled={likeLoadingId.length > 0}
                        onClick={() => { if (tweet?._id) handleTweetLike(tweet?._id) }}
                        className={`px-2 py-1 rounded-full cursor-pointer flex items-center ${tweet?.isLiked ? "text-white bg-green-700" : "text-green-900 bg-green-100"} `}>
                        <Heart size={14} />
                        <span className="ml-1 font-medium text-xs flex items-center justify-center">
                            {likeLoadingId === tweet?._id ? <Loader size={16} className="animate-spin" /> : tweet?.totalLikes}</span>
                    </button>
                    <button
                        disabled={saveTweetLoadingId.length > 0}
                        onClick={() => { if (tweet?._id) handleSaveTweet(tweet?._id) }}
                        className={`px-3 py-[5px] rounded-full cursor-pointer flex items-center ${tweet?.tweetSaved ? "text-white bg-pink-700" : "text-pink-900 bg-pink-100"} `}>
                        { saveTweetLoadingId === tweet?._id ? <Loader size={16} className="animate-spin" /> : <Bookmark size={14} />}
                    </button>
                </div>
                <span className="bg-neutral-100 text-neutral-700 px-2 py-1 text-[11px] rounded-full">{tweet && formatShortTime(tweet?.createdAt)} ago</span>
            </div>
        </div>
    );
};

export default TweetCard;