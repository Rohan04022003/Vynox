/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import axios from "axios";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/dashboard/videos`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          setVideos(response.data?.data);
        } else {
          console.log("Failed fetching videos");
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  return (
    <div className="w-full h-[200vh] bg-gray-50 p-4">
      {loading ? (
        <div className="text-center text-gray-600 mt-10">Loading videos...</div>
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
    </div>
  );
};

export default Home;
