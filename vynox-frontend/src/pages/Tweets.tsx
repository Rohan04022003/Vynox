import React, { useEffect, useState } from 'react'
import TweetCard from '../components/TweetCard'
import axios from 'axios';

const Tweets = () => {

    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchtweets() {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/dashboard/tweets`,
                    { withCredentials: true }
                );

                if (response.status === 200) {
                    settweets(response.data?.data);
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

    return (
        <div className="w-full h-[200vh] bg-gray-50 p-4">
            {/* {loading ? (
        <div className="text-center text-gray-600 mt-10">Loading Tweets...</div>
      ) : ( */}
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
                {/* {tweets.map((tweet: any) => (
            <TweetCard key={tweet._id} tweet={tweet} />
          ))} */}

                <TweetCard />

            </div>
            {/* )} */}
        </div>
    )
}

export default Tweets