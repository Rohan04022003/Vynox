/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import VideoCardSkeleton from "../components/skeleton/VideoCardSkeleton";
import axios from "axios";

const WatchHistory = () => {

  const [ videos, setVideos ] = useState([])
  const [ loading, setLoading ] = useState<boolean>(false)


  // initial load
  useEffect(() => {
    async function fetchHistory() {
      try {

        setLoading(true)

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/videos/watched/history`,{withCredentials: true},);

        if (response.status === 200) {
          const videos = await response.data?.data[0].videos
          setVideos(videos)
        }
      } catch (error) {
        console.log("fetching Video history failed:", error);
      } finally{
        setLoading(false)
      }
    }

    fetchHistory();
  }, []);

  return (
    <div className="w-full bg-gray-50 p-4">
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
      {/* for No tweets found */}
      {!loading && videos.length === 0 && (
        <div className="lg:h-[60vh] h-[78vh] flex flex-col items-center justify-center text-gray-500">
          <span>No Watched History Found.</span> <span>Try changing the filter or search keyword.</span>
        </div>
      )}
    </div>
  );
};

export default WatchHistory;
