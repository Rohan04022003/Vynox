/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import TweetCard from '../components/TweetCard'
import axios from 'axios';
import TweetCardSkeleton from '../components/skeleton/TweetCardSkeleton';
import TweetDetail from '../components/TweetDetails';

const Tweets = () => {

    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTweet, setSelectedTweet] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
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

        fetchtweets();
    }, []);

    const openTweet = (tweet: any) => {
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
                    {tweets.map((tweet: any) => (
                        <TweetCard key={tweet._id} tweet={tweet} onOpen={openTweet} />
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