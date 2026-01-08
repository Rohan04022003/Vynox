/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [playVideo, setPlayVideo] = useState({})
  const [playVideoLoading, setPlayVideoLoading] = useState(false)
  const [videos, setVideos] = useState<Video[]>([]); // yeh useState vidoes ko hold karega.
  const [comments, setComments] = useState<any>([]); // yeh useState vidoes ko hold karega.
  const [loading, setLoading] = useState(false); // yeh loading screen ke liye bana hai.
  const [commentLoading, setCommentLoading] = useState(false); // yeh loading screen ke liye bana hai.
  const [page, setPage] = useState<number>(1); // yeh by default page 1 karega.
  const [hasMoreVideos, setHasMoreVideos] = useState(true); // iska use hamne aur content next page pe hai ya nahi uske liye use kiya hai.
  const [hasMoreComments, setHasMoreCommets] = useState(true); // iska use hamne aur content next page pe hai ya nahi uske liye use kiya hai.
  const [commentPage, setCommentPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0)

  const fetchVideos = async ( // videos ko fetch karega yeh method.
    str = "",
    sortType = "desc",
    limit = 10,
    newPage?: number
  ) => {
    const pageToFetch = newPage ?? page; // yeh hamare current page number ko set krega.

    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/videos`, // yeh videos ka acutal url hai.
        {
          params: { query: str, sortType, limit, page: pageToFetch }, // query hai videos ko fetch krne ke liye.
          withCredentials: true,
        }
      );

      const fetchedVideos: Video[] = res.data?.data?.videos ?? []; // yaha pe fetchedVideos me woh filterd aur fetched videos aayenge.

      if (newPage) {
        setVideos(fetchedVideos); // videos ko setVideos me set kiya hai.
        setPage(2);
        setHasMoreVideos(fetchedVideos.length === limit); // yeh check krega ki aur content hai ya nahi means next page.
      } else {
        setVideos(prev => [...prev, ...fetchedVideos]); // next page ke content ko aad kiya hai.
        setPage(pageToFetch + 1);
        setHasMoreVideos(fetchedVideos.length === limit); // yeh check krega ki aur content hai ya nahi means next page.
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikedVideos = async ( // liked videos ko fetch karega yeh method.
    sortType = "desc",
    limit = 10,
    newPage?: number
  ) => {
    const pageToFetch = newPage ?? page; // yeh hamare current page number ko set krega.

    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/videos/user/liked`,
        {
          params:{ sortType, limit, page: pageToFetch },
          withCredentials: true,
        }
      );

      const fetchedVideos: Video[] = res.data?.data?.videos ?? []; // yaha pe fetchedVideos me woh filterd aur fetched videos aayenge.

      if (newPage) {
        setVideos(fetchedVideos); // videos ko setVideos me set kiya hai.
        setPage(2);
        setHasMoreVideos(fetchedVideos.length === limit); // yeh check krega ki aur content hai ya nahi means next page.
      } else {
        setVideos(prev => [...prev, ...fetchedVideos]); // next page ke content ko aad kiya hai.
        setPage(pageToFetch + 1);
        setHasMoreVideos(fetchedVideos.length === limit); // yeh check krega ki aur content hai ya nahi means next page.
      }
    } catch (error) {
      console.error("Error fetching liked videos:", error);
    } finally {
      setLoading(false);
    }
  };

  // current playing video ko fetch krega.
  const fetchCurrentPlayingVideo = async (videoId?: string) => {
    if (!videoId) return;
    try {

      setPlayVideoLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/videos/${videoId}`, // yeh current playing video ka data dega.
        { withCredentials: true },
      );

      const fetchedVideo = res.data?.data[0] || {};
      setPlayVideo(fetchedVideo);

    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setPlayVideoLoading(false)
    }

  }



  // yeh current playing video ke comments ko fetch krega.
  const fetchCurrentPlayingVideoComments = async (
    videoId?: string,
    pageToFetch = 1,
    limit = 10
  ) => {
    if (!videoId) return;

    try {
      setCommentLoading(true);

      const res: any = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/comments/${videoId}`,
        {
          params: { limit, page: pageToFetch },
          withCredentials: true,
        }
      );

      const fetchedComments = res.data?.data?.comments ?? [];
      setTotalComments(res.data?.data?.totalComments)

      if (pageToFetch === 1) {
        setComments(fetchedComments);
      } else {
        setComments((prev: any[]) => [...prev, ...fetchedComments]);
      }

      setCommentPage(pageToFetch + 1);
      setHasMoreCommets(fetchedComments.length === limit);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setCommentLoading(false);
    }
  };



  return (
    <VideosContext.Provider
      value={{
        videos,
        loading,
        hasMoreVideos,
        fetchVideos,
        setVideos,
        playVideo,
        setPlayVideo,
        playVideoLoading,
        fetchCurrentPlayingVideo,
        comments,
        setComments,
        page,
        commentLoading,
        hasMoreComments,
        fetchCurrentPlayingVideoComments,
        commentPage,
        setCommentPage,
        totalComments,
        fetchLikedVideos
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
