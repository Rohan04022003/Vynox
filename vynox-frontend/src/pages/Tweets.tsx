/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import TweetCardSkeleton from "../components/skeleton/TweetCardSkeleton";
import TweetDetail from "../components/TweetDetails";
import type { Tweet, tweetsProps } from "../types";
import TweetCard from "../components/TweetCard";
import FilterBar from "../components/FilterBar";
import { useTweetsContext } from "../context/TweetsContext";
import { ArrowDown } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Tweets = ({ search, tagSearch }: tweetsProps) => {
    const [selectedTweet, setSelectedTweet] = useState<Tweet | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { tweets, setTweets, loading, fetchTweets, hasMoreTweets } = useTweetsContext();
    const [sortType, setSortType] = useState<string>("desc");
    const [limit, setLimit] = useState<number>(10);
    const [subscribeLoader, setSubscribeLoader] = useState<string>("")


    const openTweet = (tweet: Tweet) => {
        setSelectedTweet(tweet);
        setIsOpen(true);
    };


    // it is for frequently like update on frontent only.
    function handleLikeUpdate(id: string) {
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
    }

    // initial load
    useEffect(() => {
        fetchTweets("", "desc", 10, 1);
    }, []);

    // channel subscription function 
    const handleSubscribe = async (channelId: string) => {
        try {
            setSubscribeLoader(channelId)
            let isSubscribed = true
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/subscriptions/c/${channelId}`, {}, { withCredentials: true })

            if (response.status === 200) {
                setTweets((prev: Tweet[]) => {

                    if (!Array.isArray(prev)) return prev;

                    return prev.map((t: any) => {
                        if (t.owner._id !== channelId) return t;
                        isSubscribed = t.isSubscribed;
                        return {
                            ...t,
                            isSubscribed: !isSubscribed,
                        };
                    })
                })
                if (!isSubscribed) {
                    toast.success("Subscribed")
                } else {
                    toast.success("Unsubscribed")

                }
            }

        } catch (error) {
            toast.error("Subscribe toggle failed")
            console.log("Subscribe toggle failed:", error);
        } finally {
            setSubscribeLoader("")
        }
    }

    return (
        <div className="w-full bg-gray-50 p-4 overflow-x-hidden">

            {/* FilterBar */}
            <FilterBar
                sortType={sortType}
                setSortType={setSortType}
                limit={limit}
                setLimit={setLimit}
                showTags
                onFilterChange={({ tag, sortType, limit }) => { // jb bhi filter change hoga yeh function run ho. like tag, sortType, limit
                    fetchTweets(tag || "", sortType, limit, 1);
                }}
            />


            {/* Tweets Grid */}
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
                {tweets.map((tweet: Tweet) => (
                    <TweetCard
                        key={tweet._id}
                        tweet={tweet}
                        onOpen={openTweet}
                        handleLikeUpdate={handleLikeUpdate}
                        handleSubscribe={handleSubscribe}
                        subscribeLoader={subscribeLoader}
                    />
                ))}

                {/* Skeleton loader */}
                {loading &&
                    Array.from({ length: limit }).map((_, index) => (
                        <TweetCardSkeleton key={index} />
                    ))}
            </div>

            {/* for No tweets found */}
            {!loading && tweets.length === 0 && (
                <div className="lg:h-[60vh] h-[78vh] flex flex-col items-center justify-center text-gray-500">
                    <span>No tweets found.</span> <span>Try changing the filter or search keyword.</span>
                </div>
            )}

            {/* Load More Button */}
            {hasMoreTweets && !loading && tweets.length !== 0 && (
                <div className="flex justify-center mt-5 mb-10">
                    <button
                        className="flex items-center gap-1 bg-neutral-100 w-fit px-3 py-1 m-auto rounded-lg text-neutral-700 cursor-pointer"
                        onClick={() => fetchTweets(search || tagSearch || "", sortType, limit)}
                    >
                        Load More Tweets <ArrowDown size={15} className="mt-1" />
                    </button>
                </div>
            )}

            {/* Tweet Detail Drawer */}
            {isOpen && (
                <TweetDetail tweet={selectedTweet} onClose={() => setIsOpen(false)} />
            )}
        </div>
    );
};

export default Tweets;
