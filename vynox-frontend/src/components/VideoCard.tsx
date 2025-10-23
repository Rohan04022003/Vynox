/* eslint-disable @typescript-eslint/no-explicit-any */
import { Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type VideoCardProps = {
  video: any;
};

const VideoCard = ({ video }: VideoCardProps) => {
  const owner = video.owner[0];

  // Format duration (seconds → mm:ss)
  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="w-64 bg-white rounded-md shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300">
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={video.thumbnail.url}
          alt={video.title}
          className="w-full h-36 object-cover"
        />
        <span className="absolute bottom-1 right-1 bg-black text-white text-xs px-1 rounded">
          {formatDuration(video.duration)}
        </span>
      </div>

      {/* Video Info */}
      <div className="p-3 flex flex-col gap-2">
        {/* Title */}
        <h3 className="text-sm font-semibold line-clamp-2">{video.title}</h3>

        {/* Owner Info */}
        <div className="flex items-center gap-2">
          <img
            src={owner.avatar.url}
            alt={owner.username}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-xs text-neutral-600">{owner.username}</span>
        </div>

        {/* Views / Likes / Time */}
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-3">
            <span>{video.views} views</span>
          <span className="flex items-center gap-1">
            <Heart size={14} className="text-red-500" />
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
