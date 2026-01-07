/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { BellRing, Edit2, Heart, Loader, MoreVertical } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "../context/userContext";
import type { TweetCardProps } from "../types";
import { formatShortTime } from "../utils/timeShortFormater";

const TweetCard: React.FC<TweetCardProps> = ({ tweet, onOpen, handleLikeUpdate, handleSubscribe, subscribeLoader }) => {
    const owner = Array.isArray(tweet?.owner) ? tweet?.owner[0] : tweet?.owner;
    const [loading, setLoading] = useState<boolean>(false)
    const { user } = useUser();

    const handleLike = async (id: string) => {
        try {
            setLoading(true);
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/likes/toggle/t/${id}`, {},
                { withCredentials: true }
            );

            if (response.status === 200) {
                handleLikeUpdate(id)
            } else {
                toast.error("please try to like after sometime.");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.data);
        } finally {
            setLoading(false);
        }
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
                        onClick={() => owner?._id && handleSubscribe(owner?._id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold text-red-700 bg-red-50 cursor-pointer ${user?._id === owner?._id ? "hidden" : "flex"}`}>{subscribeLoader === owner?._id ? <Loader size={16} className="animate-spin" /> : tweet?.isSubscribed ? <BellRing size={16} /> : "Subscribe"}</button>
                    <MoreVertical size={18} className="text-neutral-600" />
                </div>
            </div>
            <p className="text-sm mb-3 text-neutral-600">{tweet?.content && tweet.content.length > 30 ? tweet.content.slice(0, 30) + "..." : tweet?.content}</p>
            <div
                onClick={() => tweet && onOpen(tweet)}
                className="w-full h-32">
                <img src={tweet?.tweetImage?.url} alt="tweet-images" className="rounded-sm h-full w-full bg-center object-cover cursor-pointer" />
            </div>

            <div className="flex items-center justify-between mt-3 w-full">
                <button
                    onClick={() => { if (tweet?._id) handleLike(tweet?._id) }}
                    className={`px-2 py-1 rounded-full cursor-pointer flex items-center ${tweet?.isLiked ? "text-white bg-green-700" : "text-green-900 bg-green-100"} `}>
                    <Heart size={14} />
                    <span className="ml-1 font-medium text-xs flex items-center justify-center">
                        {loading ? <Loader size={16} className="animate-spin" /> : tweet?.totalLikes}</span>
                </button>
                <span className="text-xs text-neutral-700">{tweet && formatShortTime(tweet?.createdAt)} ago</span>
            </div>
        </div>
    );
};

export default TweetCard;