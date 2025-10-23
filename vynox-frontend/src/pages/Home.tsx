/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import axios from "axios";

const Home = () => {

  const [videos, setVideos] = useState([])
  const [ leading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/dashboard/videos`, { withCredentials: true })

      if( response.status === 200) {
        setVideos(response.data?.data)
        setLoading(false)
      } else {
        setLoading(false)
        console.log("Failed fetching videos")
      }

    }

    fetchVideos();
  }, [])

  return (
    <div className="w-full p-4">
      <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {videos.map((vid: any) => (
          <VideoCard key={vid._id} video={vid} />
        ))}
      </div>
    </div>
  );
};

export default Home;