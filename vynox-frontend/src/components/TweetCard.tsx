/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThumbsUp } from "lucide-react"

type TweetCardProps = {
    tweet: any
}

const TweetCard = ({ tweet }: TweetCardProps) => {
    const owner = tweet.owner?.[0];
    return (
        <div className='border border-neutral-300 shadow-lg w-full p-2 rounded-lg'>
            <div className='flex items-center gap-2 mb-2'>
                <img src={owner?.avatar?.url} alt="user-avatar" className='w-9 rounded-full' />
                <div><span className='text-sm font-semibold text-neutral-700'>{owner?.username}</span>
                    {tweet?.isEdited ? "Edited" : ""}
                </div>
            </div>
            <p className="text-sm mb-3 text-neutral-600">{tweet?.content.length > 30 ? tweet?.content.slice(0, 30) + "..." : tweet?.content}</p>
            <div className="w-full h-32">
                <img src={tweet?.tweetImage?.url} alt="tweet-images" className="rounded-sm h-full w-full bg-center object-cover cursor-pointer" />
            </div>

            <div className="flex items-center justify-between mt-3 w-full">
                <div className={`px-3 py-1 rounded-full cursor-pointer flex items-center  ${tweet?.isLiked ? "text-white bg-green-700" : "text-green-900 bg-green-100"} `}><ThumbsUp size={14} /> <span className="ml-1 font-medium text-xs">{tweet?.totalLikes}</span></div>
                <button className='px-3 py-1 rounded-full text-xs font-semibold text-pink-700 bg-pink-50 cursor-pointer'>Subscribe</button>
            </div>
        </div>
    )
}

export default TweetCard