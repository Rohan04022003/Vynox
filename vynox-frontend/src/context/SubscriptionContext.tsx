/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { createContext, useContext, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import type { SubscribeDetailsMap, SubscriptionContextType } from "../types";

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscribeLoader, setSubscribeLoader] = useState<boolean>(false);
  const [subscribeLoaderId , setSubscribeLoaderId ] = useState<string>("");
  const [subscribeDetails, setSubscribeDetails] =
    useState<SubscribeDetailsMap>({});

  const handleSubscribe = async (channelId: string) => {
    try {
      setSubscribeLoader(true);
      setSubscribeLoaderId(channelId)

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/subscriptions/c/${channelId}`,
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        const { isSubscribed, totalSubscribers } = res.data.data;

        setSubscribeDetails(prev => ({
          ...prev,
          [channelId]: { isSubscribed, totalSubscribers }
        }));

        toast.success(isSubscribed ? "Subscribed" : "Unsubscribed");
      }
    } catch (err) {
      toast.error("Subscribe toggle failed");
      console.error(err);
    } finally {
     setSubscribeLoaderId("")
      setSubscribeLoader(false);
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        handleSubscribe,
        subscribeDetails,
        subscribeLoader,
        subscribeLoaderId ,
        setSubscribeDetails
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error("useSubscription must be used inside SubscriptionProvider");
  }
  return ctx;
};
