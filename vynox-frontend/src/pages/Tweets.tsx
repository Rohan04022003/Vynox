/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import TweetCardSkeleton from "../components/skeleton/TweetCardSkeleton";
import TweetDetail from "../components/TweetDetails";
import type { Tweet, tweetsProps } from "../types";
import TweetCard from "../components/TweetCard";
import FilterBar from "../components/FilterBar";
import { useTweetsContext } from "../context/TweetsContext";

const Tweets = ({ search, setSearch, tagSearch, setTagSearch }: tweetsProps) => {
    const [selectedTweet, setSelectedTweet] = useState<Tweet | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { tweets, setTweets, loading, fetchTweets, hasMore } = useTweetsContext();
    const [sortType, setSortType] = useState<string>("desc");
    const [limit, setLimit] = useState<number>(20);

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
        fetchTweets("", "desc", 20, 1);
    }, []);

    return (
        <div className="w-full bg-gray-50 p-4 overflow-x-hidden">

            {/* FilterBar */}
            <FilterBar
                search={search}
                setSearch={setSearch}
                tagSearch={tagSearch}
                setTagSearch={setTagSearch}
                sortType={sortType}
                setSortType={setSortType}
                limit={limit}
                setLimit={setLimit}
                fetchTweets={fetchTweets}
                setTweets={setTweets}
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
            {hasMore && !loading && tweets.length !== 0 && (
                <div className="flex justify-center mt-10">
                    <button
                        className="px-3 py-2 bg-neutral-600 text-white rounded-md hover:bg-neutral-700 text-xs cursor-pointer"
                        onClick={() => fetchTweets(search || tagSearch || "", sortType, limit)}
                    >
                        Click Here to Load More Tweets
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
