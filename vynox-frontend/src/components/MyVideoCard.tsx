import { formatShortTime } from "../utils/timeShortFormater";

/* eslint-disable @typescript-eslint/no-explicit-any */
const MyVideoCard = ({ key, video }: { key: any; video: any; }) => {
    return (
        <div
            key={key}
            className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow"
        >
            <img src={video.thumbnail.url} alt="video-thumbnail" className="w-full bg-cover object-center h-30" />
            <div className="p-3">
                <p className="text-sm font-medium">{video.title}</p>
                <p className="text-xs text-gray-500 mt-1">{video.views} views • {formatShortTime(video.createdAt)}</p>
            </div>
            <div className="px-2 flex items-center gap-2 pb-3">
                <button className={`${video.isPublished ? "bg-green-200 text-green-700" : "bg-blue-200 : text-blue-700"} text-[10px] font-medium rounded-full px-3 py-1`}>{video.isPublished ? "Published" : "Private"}</button>
                <button className={`bg-orange-200 text-orange-700 text-[10px] font-medium rounded-full px-3 py-1`}>Edit</button>
                <button className={`bg-red-200 text-red-700 text-[10px] font-medium rounded-full px-3 py-1`}>Delete</button>
            </div>
        </div>
    )
}

export default MyVideoCard