import { useState, useEffect } from "react";
import axios from "axios";
import type { Tweet } from "../types";

export function useTweets() {
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState(true);

    async function fetchTweets(
        str?: string,
        sortType = "desc",
        limit = 20,
        newPage?: number // if filter change
    ) {
        const pageToFetch = newPage || page;

        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/tweets`, {
                params: {
                    content: str || "",
                    sortType,
                    limit,
                    page: pageToFetch,
                },
                withCredentials: true,
            });

            const fetchedTweets: Tweet[] = res.data?.data?.tweets || [];

            if (newPage) {
                // filter changed → replace
                setTweets(fetchedTweets);
                setPage(2);
                setHasMore(fetchedTweets.length === limit);
            } else {
                // load more → append
                setTweets(prev => [...prev, ...fetchedTweets]);
                setPage(pageToFetch + 1);
                setHasMore(fetchedTweets.length === limit);
            }
        } catch (error) {
            console.log("Error fetching tweets:", error);
        } finally {
            setLoading(false);
        }
    }

    // first load
    useEffect(() => {
        setTweets([]);
        setPage(1);
        setHasMore(true);
        fetchTweets("", "desc", 20, 1);
    }, []);

    return { tweets, setTweets, loading, fetchTweets, hasMore };
}
