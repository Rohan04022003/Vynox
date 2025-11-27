/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { Edit2, MoreVertical, ThumbsUp } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import toast from "react-hot-toast";

interface Owner {
    avatar?: { url?: string };
    username?: string;
}

interface Tweet {
    createdAt: string | number | Date;
    _id?: string;
    owner?: Owner[];
    content: string;
    tweetImage?: { url?: string };
    isEdited?: boolean;
    isLiked?: boolean;
    totalLikes?: number;
}

interface TweetCardProps {
    tweet: Tweet;
    onOpen: (tweet: Tweet) => void;
    setTweets: Dispatch<SetStateAction<never[]>>
}

const TweetCard: React.FC<TweetCardProps> = ({ tweet, onOpen, setTweets }) => {
    const owner = tweet.owner?.[0];
    const [loading, setLoading] = useState<boolean>(false)


    async function handleLike(id: string) {
        console.log(id)
        try {
            setLoading(true);
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/likes/toggle/t/${id}`,
                { withCredentials: true }
            );

            if (response.status === 200) {
                setTweets(response.data?.data?.tweets);
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
                        <p className="text-[11px] text-neutral-600 -mt-1">{tweet?.isEdited ? <p className="flex items-center gap-[2px]"><Edit2 size={10} /> Edited</p> : ""}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button className='px-3 py-1 rounded-full text-xs font-semibold text-pink-700 bg-pink-50 cursor-pointer'>Subscribe</button>
                    <MoreVertical size={18} className="text-neutral-600" />
                </div>
            </div>
            <p className="text-sm mb-3 text-neutral-600">{tweet?.content.length > 30 ? tweet?.content.slice(0, 30) + "..." : tweet?.content}</p>
            <div
                onClick={() => onOpen(tweet)}
                className="w-full h-32">
                <img src={tweet?.tweetImage?.url} alt="tweet-images" className="rounded-sm h-full w-full bg-center object-cover cursor-pointer" />
            </div>

            <div className="flex items-center justify-between mt-3 w-full">
                <button onClick={() => { if (tweet?._id) handleLike(tweet?._id) }} className={`px-3 py-1 rounded-full cursor-pointer flex items-center  ${tweet?.isLiked ? "text-white bg-green-700" : "text-green-900 bg-green-100"} `}><ThumbsUp size={14} /><span className="ml-1 font-medium text-xs flex items-center justify-center">{loading ? <span className="loader"></span> : tweet?.totalLikes}</span></button>
                <span className="text-xs text-neutral-700">{formatDistanceToNow(new Date(tweet?.createdAt))} ago</span>
            </div>
        </div>
    );
};

export default TweetCard;