/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";
import axios from "axios";
import type { Tweet, TweetsContextType } from "../types";
import toast from "react-hot-toast";

const TweetsContext = createContext<TweetsContextType | undefined>(undefined);

export const TweetsProvider = ({ children }: { children: ReactNode }) => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [hasMoreTweets, setHasMoreTweets] = useState(true);
  const [likeLoadingId, setLikeLoadingId] = useState<string>("")
  const [saveTweetLoadingId, setSaveTweetLoadingId] = useState<string>("")

  const fetchTweets = async (
    str = "",
    sortType = "desc",
    limit = 10,
    newPage?: number
  ) => {
    const pageToFetch = newPage || page;
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/tweets`, {
        params: { content: str, sortType, limit, page: pageToFetch },
        withCredentials: true,
      });

      const fetchedTweets: Tweet[] = res.data?.data?.tweets || [];

      if (newPage) {
        // filter changed → replace
        setTweets(fetchedTweets);
        setPage(2);
        setHasMoreTweets(fetchedTweets.length === limit);
      } else {
        // load more → append
        setTweets(prev => [...prev, ...fetchedTweets]);
        setPage(pageToFetch + 1);
        setHasMoreTweets(fetchedTweets.length === limit);
      }
    } catch (err) {
      console.error("Error fetching tweets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTweetLike = async (id: string) => {
    try {
      setLikeLoadingId(id);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/likes/toggle/t/${id}`, {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        setTweets(prev =>
          prev.map(t =>
            t._id === id
              ? {
                ...t,
                isLiked: !t.isLiked,
                totalLikes: t.isLiked ? t.totalLikes! - 1 : t.totalLikes! + 1,
              }
              : t
          )
        );
      } else {
        toast.error("please try to like after sometime.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.data);
    } finally {
      setLikeLoadingId("");
    }
  }
  const handleSaveTweet = async (id: string) => {
    try {
      setSaveTweetLoadingId(id);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/tweets/save/${id}`, {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        setTweets(prev =>
          prev.map(t =>
            t._id === id
              ? {
                ...t,
                tweetSaved: !t.tweetSaved,
              }
              : t
          )
        );

      response?.data?.data.saved ? toast.success("Saved") : toast.success("Unsaved")

      } else {
        toast.error("please try to save tweet after sometime.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.data);
    } finally {
      setSaveTweetLoadingId("");
    }
  }

  return (
    <TweetsContext.Provider
      value={{ tweets, setTweets, loading, fetchTweets, hasMoreTweets, handleTweetLike, likeLoadingId, handleSaveTweet, saveTweetLoadingId }}
    >
      {children}
    </TweetsContext.Provider>
  );
};

// custom hook
export const useTweetsContext = () => {
  const context = useContext(TweetsContext);
  if (!context) {
    throw new Error("useTweetsContext must be used within a TweetsProvider");
  }
  return context;
};
