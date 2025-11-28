import { useEffect, useState } from "react";
import TweetCardSkeleton from "../components/skeleton/TweetCardSkeleton";
import TweetDetail from "../components/TweetDetails";
import type { Tweet, tweetsProps } from "../types";
import TweetCard from "../components/TweetCard";
import { FilterIcon } from "lucide-react";

const Tweets = ({ tweets, setTweets, fetchTweets, loading, hasMore }: tweetsProps & { hasMore: boolean }) => {
    const [selectedTweet, setSelectedTweet] = useState<Tweet | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [sortType, setSortType] = useState("desc");
    const [limit, setLimit] = useState(20);
    const [ tagSearch, setTagSearch ] = useState<string>("")

const popularTags: string[] = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "NodeJS",
  "ExpressJS",
  "MongoDB",
  "TypeScript",
  "NextJS",
  "Frontend",
  "Backend",
  "FullStack",
  "API",
  "WebDevelopment",
  "Programming",
  "Redux",
  "TailwindCSS",
  "GitHub",
  "MERNStack",
  "CodeNewbie"
];

    const handleTagSearch = (tag: string) =>{
        setTagSearch(tag);
        setTweets([])
        fetchTweets(tag.toLocaleLowerCase(), sortType, limit);
    }

    const openTweet = (tweet: Tweet) => {
        setSelectedTweet(tweet);
        setIsOpen(true);
    };

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

    // Fetch tweets on sort/limit change
    useEffect(() => {
        fetchTweets("", sortType, limit, 1); // replace tweets
    }, [sortType, limit]);

    return (
        <div className="w-full bg-gray-50 p-4 overflow-x-hidden">

            {/* Filter Bar */}
            <div className="w-full flex items-center justify-between p-3 pr-18 bg-white shadow rounded-xl mb-4 relative overflow-hidden">
                <div className="flex items-center gap-3 hide-scrollbar">
                    {
                        popularTags.map((tag, index) => {
                            return (
                                <button onClick={() => handleTagSearch(tag)} key={index} className={`px-3 py-1 rounded-md text-xs cursor-pointer ${tag === tagSearch ? "bg-neutral-700 text-neutral-100" : "bg-neutral-200 text-neutral-700"}`}>{tag}</button>
                            )
                        })
                    }
                </div>
                <button className="fixed right-7 w-10 h-9 rounded-md flex items-center justify-center bg-neutral-200">
                    <FilterIcon className="text-neutral-700" />
                </button>
                <div className={`flex flex-col hidden`}>
                    {/* Sort */}
                    <div className="flex flex-col">
                        <label className="text-sm text-neutral-600 font-medium mb-1">Sort By</label>
                        <select
                            className="px-3 py-2 border border-neutral-300 rounded-md"
                            value={sortType}
                            onChange={(e) => setSortType(e.target.value)}
                        >
                            <option value="desc">Latest (DESC)</option>
                            <option value="asc">Oldest (ASC)</option>
                        </select>
                    </div>

                    {/* Limit */}
                    <div className="flex flex-col">
                        <label className="text-sm text-neutral-600 font-medium mb-1">Page Limit</label>
                        <select
                            className="px-3 py-2 border border-neutral-300 rounded-md"
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                        >
                            <option value={10}>10 per page</option>
                            <option value={20}>20 per page</option>
                            <option value={50}>50 per page</option>
                            <option value={100}>100 per page</option>
                        </select>
                    </div>
                </div>
            </div>

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
                <div className="h-[60vh] flex flex-col items-center justify-center text-gray-500">
                    <span>No tweets found.</span> <span>Try changing the filter or search keyword.</span>
                </div>
            )}

            {/* Load More Button */}
            {hasMore && !loading && (
                <div className="flex justify-center mt-10">
                    <button
                        className="px-3 py-2 bg-neutral-600 text-white rounded-md hover:bg-neutral-700 text-xs cursor-pointer"
                        onClick={() => fetchTweets("", sortType, limit)}
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
