import { ArrowRight } from "lucide-react";
import type { TweetDetailProps } from "../types";

const TweetDetail: React.FC<TweetDetailProps> = ({ tweet, onClose }) => {
    const owner = tweet?.owner;

    return (
        <div className="
        fixed right-0 top-16 h-[91vh] lg:w-1/3 bg-white shadow-xl 
        border-l border-neutral-300 p-4 z-50 
        animate-slideLeft
    ">
            <button onClick={onClose} className="mb-3 cursor-pointer">
                <ArrowRight size={20} />
            </button>

            <div className="flex items-center gap-2 mb-2">
                <img src={owner?.avatar?.url} className="w-10 rounded-full" />
                <div>
                    <p className="font-semibold">{owner?.username}</p>
                </div>
            </div>

            <p className="text-sm text-neutral-700 mb-3">{tweet?.content}</p>

            {tweet?.tweetImage?.url && (
                <img src={tweet.tweetImage.url} className="rounded-md w-full" />
            )}
        </div>
    );
};

export default TweetDetail;
