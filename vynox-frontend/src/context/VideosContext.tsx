/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import type { Video, VideosContextType } from "../types";


const VideosContext = createContext<VideosContextType | undefined>(undefined);

export const VideosProvider = ({ children }: { children: ReactNode }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchVideos = async (
    str = "",
    sortType = "desc",
    limit = 10,
    newPage?: number
  ) => {
    const pageToFetch = newPage ?? page;

    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/videos`,
        {
          params: { query: str, sortType, limit, page: pageToFetch },
          withCredentials: true,
        }
      );

      const fetchedVideos: Video[] = res.data?.data?.videos ?? [];

      if (newPage) {
        setVideos(fetchedVideos);
        setPage(2);
        setHasMore(fetchedVideos.length === limit);
      } else {
        setVideos(prev => [...prev, ...fetchedVideos]);
        setPage(pageToFetch + 1);
        setHasMore(fetchedVideos.length === limit);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VideosContext.Provider
      value={{
        videos,
        loading,
        hasMore,
        fetchVideos,
        setVideos,
      }}
    >
      {children}
    </VideosContext.Provider>
  );
};


export const useVideosContext = () => {
  const context = useContext(VideosContext);
  if (!context) {
    throw new Error("useVideosContext must be used within a VideosProvider");
  }
  return context;
};
