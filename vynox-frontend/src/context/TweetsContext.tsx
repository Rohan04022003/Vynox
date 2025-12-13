/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";
import axios from "axios";
import type { Tweet, TweetsContextType } from "../types";

const TweetsContext = createContext<TweetsContextType | undefined>(undefined);

export const TweetsProvider = ({ children }: { children: ReactNode }) => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [hasMoreTweets, setHasMoreTweets] = useState(true);

  const fetchTweets = async (
    str = "",
    sortType = "desc",
    limit = 20,
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

  return (
    <TweetsContext.Provider
      value={{ tweets, setTweets, loading, fetchTweets, hasMoreTweets }}
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
