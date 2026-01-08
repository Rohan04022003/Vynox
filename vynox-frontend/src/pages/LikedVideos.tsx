/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import VideoCardSkeleton from "../components/skeleton/VideoCardSkeleton";
import FilterBar from "../components/FilterBar";
import { useVideosContext } from "../context/VideosContext";
import { ArrowDown } from "lucide-react";

const LikedVideos = () => {
    const [sortType, setSortType] = useState<string>("desc");
    const [limit, setLimit] = useState<number>(20);
    const { videos, setVideos, loading, fetchVideos, hasMoreVideos } = useVideosContext();

    // initial load
    useEffect(() => {
        fetchVideos("", sortType, limit, 1);
    }, [sortType, limit]);

    return (
        <div className="w-full bg-gray-50 p-4 overflow-x-hidden">
            {/* FilterBar */}
            <FilterBar
                sortType={sortType}
                setSortType={setSortType}
                limit={limit}
                setLimit={setLimit}
                fetchVideos={fetchVideos}
                setVideos={setVideos}
            />
            {loading ? (
                <div
                    className="
            grid 
            gap-2 
            xl:grid-cols-5 
            lg:grid-cols-4 
            md:grid-cols-3 
            sm:grid-cols-2 
            grid-cols-1 
            justify-items-center
          "
                >
                    {Array.from({ length: 20 }).map((_, index) => (
                        <VideoCardSkeleton key={index} />
                    ))}
                </div>
            ) : (
                <div
                    className="
            grid 
            gap-2 
            xl:grid-cols-5 
            lg:grid-cols-4 
            md:grid-cols-3 
            sm:grid-cols-2 
            grid-cols-1 
            justify-items-center
          "
                >

                    {videos.map((vid: any) => (
                        <VideoCard key={vid._id} video={vid} />
                    ))}

                </div>
            )}
            {/* for No video found */}
            {!loading && videos.length === 0 && (
                <div className="lg:h-[60vh] h-[78vh] flex flex-col items-center justify-center text-gray-500">
                    <span>No videos found.</span> <span>Try changing the filter or search keyword.</span>
                </div>
            )}
            {/* Load More Button */}
            {hasMoreVideos && !loading && videos.length !== 0 && (
                <div className="flex justify-center mt-5 mb-10">
                    <button
                        className="flex items-center gap-1 bg-neutral-100 w-fit px-3 py-1 m-auto rounded-lg text-neutral-700 cursor-pointer"
                        onClick={() => fetchVideos("", sortType, limit)}
                    >
                        Load More Videos <ArrowDown size={15} className="mt-1" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default LikedVideos;
