/* eslint-disable @typescript-eslint/no-explicit-any */
import { Eye, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { formatDuration } from "../utils/videoDuration";

type VideoCardProps = {
    video: any;
};

const VideoCard = ({ video }: VideoCardProps) => {
    const owner = video.owner?.[0];

    return (
        <div
            className="
        w-full max-w-[320px] 
        bg-white 
        rounded-lg 
        shadow-md 
        overflow-hidden 
        cursor-pointer 
        hover:shadow-lg 
        transition-all 
        duration-300
      "
        >
            {/* Thumbnail */}
            <div className="relative">
                <img
                    src={video.thumbnail?.url}
                    alt={video.title}
                    className="w-full h-28 sm:h-32 object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] px-1.5 py-0.5 rounded">
                    {formatDuration(video.duration)}
                </span>
            </div>

            {/* Info */}
            <div className="p-2 flex flex-col gap-1">
                <h3 className="text-sm font-semibold line-clamp-2">{video.title}</h3>

                {/* Owner Info */}
                <div className="flex items-center gap-2 mt-1">
                    <img
                        src={owner?.avatar?.url}
                        alt={owner?.username}
                        className="w-7 h-7 rounded-full object-cover border border-gray-200"
                    />
                    <span className="text-xs text-neutral-600">{owner?.username}</span>
                </div>

                {/* Views / Likes / Time */}
                <div className="flex items-center justify-between text-xs text-neutral-500 mt-1">
                    <div className="flex items-center gap-1">
                        <span className="flex items-center gap-1 px-3 py-[2px] rounded-full bg-neutral-50"><Eye size={14} className="" /> {video.views}</span>
                        <span className="flex items-center gap-1 px-3 py-[2px] rounded-full bg-neutral-50">
                            <ThumbsUp size={14} className="" />
                            {video.likeCount}
                        </span>
                    </div>
                    <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
