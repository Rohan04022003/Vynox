/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import VideoCardSkeleton from "../components/skeleton/VideoCardSkeleton";
import axios from "axios";
import vynox from "../assets/vynox.png"
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const WatchHistory = () => {

  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [videoHistoryDeleteLoading, setVideoHistoryDeleteLoading] = useState<string>("")
  const [clearAllHistoryLoading, setClearAllHistoryLoading] = useState<boolean>(false)

  // initial load
  useEffect(() => {
    async function fetchHistory() {
      try {

        setLoading(true)

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/videos/watched/history`, { withCredentials: true },);

        if (response.status === 200) {
          const videos = await response.data?.data[0].videos
          setVideos(videos)
        }
      } catch (error) {
        console.log("fetching Video history failed:", error);
      } finally {
        setLoading(false)
      }
    }

    fetchHistory();
  }, []);

  // delete history one by one
  const handleDeleteHistory = async (watchedHistoryId: string) => {
    try {
      setVideoHistoryDeleteLoading(watchedHistoryId);

      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/videos/delete-history/${watchedHistoryId}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setVideos(prev =>
          prev.filter(v => v.watchHistoryId !== watchedHistoryId)
        );
        toast.success("video remove from watch history")
      }

    } catch (error) {
      toast.error("Failed during deleting video history");
      console.error("Failed during deleting video history:", error);
    } finally {
      setVideoHistoryDeleteLoading("");
    }
  };

  // clear all history
  const handleClearAllHistory = async () => {
    try {
      setClearAllHistoryLoading(true)

      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/videos/watched/clear-history`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setVideos([])
        toast.success("Cleared all history")
      }

    } catch (error) {
      toast.error("Failed during deleting videos history");
      console.error("Failed during deleting videos history:", error);
    } finally {
      setClearAllHistoryLoading(false)
    }
  };

  return (
    <div className="w-full bg-gray-50 p-4">
      <div className="flex w-full items-center justify-between mb-5">
        <h2 className="font-semibold text-neutral-700">Watch History</h2>
        <button
          onClick={handleClearAllHistory}
          className={`${videos.length > 0 ? "flex" : "hidden"} bg-neutral-200 px-3 py-1 rounded-md text-neutral-700 text-[12px] font-medium cursor-pointer`}>{clearAllHistoryLoading ? <Loader size={17} className="text-neutral-700 animate-spin" /> : "Clear All"}</button>
      </div>
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
            <VideoCard key={vid._id} video={vid} handleDeleteHistory={handleDeleteHistory} videoHistoryDeleteLoading={videoHistoryDeleteLoading} />
          ))}

        </div>
      )}
      {/* for No tweets found */}
      {!loading && videos.length === 0 && (
        <div className="lg:h-[60vh] h-[78vh] flex flex-col items-center justify-center text-gray-500">
          <img src={vynox} alt="vynox-logo" className="w-14 opacity-50" />
          <span>No Watched History Found.</span>
        </div>
      )}
    </div>
  );
};

export default WatchHistory;
