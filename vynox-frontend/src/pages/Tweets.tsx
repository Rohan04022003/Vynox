
import { useEffect, useState } from 'react';
import axios from 'axios';
import TweetCardSkeleton from '../components/skeleton/TweetCardSkeleton';
import TweetDetail from '../components/TweetDetails';
import type { Tweet } from '../types';
import TweetCard from '../components/TweetCard';



const Tweets = () => {

    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTweet, setSelectedTweet] = useState<Tweet | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    async function fetchtweets() {
        try {
            setLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/tweets`,
                { withCredentials: true }
            );

            if (response.status === 200) {
                setTweets(response.data?.data?.tweets);
            } else {
                console.log("Failed fetching tweets");
            }
        } catch (error) {
            console.error("Error fetching tweets:", error);
        } finally {
            setLoading(false);
        }
    }

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

    useEffect(() => {
        fetchtweets();
    }, []);

    const openTweet = (tweet: Tweet) => {
        setSelectedTweet(tweet);
        setIsOpen(true);
    };

    return (
        <div className="w-full h-[200vh] bg-gray-50 p-4">
            {loading ? (
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
                    {Array.from({ length: 20 }).map((_, index) => (
                        <TweetCardSkeleton key={index} />
                    ))}
                </div>
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
                    {tweets.map((tweet: Tweet) => (
                        <TweetCard key={tweet._id} tweet={tweet} onOpen={openTweet} handleLikeUpdate={handleLikeUpdate} />
                    ))}

                </div>
            )}


            {/* Half Screen Drawer */}
            {isOpen && (
                <TweetDetail tweet={selectedTweet} onClose={() => setIsOpen(false)} />
            )}
        </div>
    )
}

export default Tweets