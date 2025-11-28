import type { Dispatch, SetStateAction } from "react";

// tweetTypes.ts
export interface Owner {
  _id: string;
  avatar?: { url?: string };
  username?: string;
}

export interface Tweet {
  createdAt: string | number | Date;
  _id: string;
  owner?: Owner[];
  content: string;
  tweetImage?: { url?: string };
  isEdited?: boolean;
  isLiked?: boolean;
  totalLikes?: number;
}

export interface TweetCardProps {
  tweet: Tweet;
  onOpen: (tweet: Tweet) => void;
  handleLikeUpdate: (id: string) => void;
}

export interface TweetDetailProps {
  tweet: Partial<Tweet> | null;
  onClose: () => void;
}

export interface isOpenSideNavProps {
    setIsOpenNav: Dispatch<SetStateAction<boolean>>;
    isOpen: boolean;
    fetchTweets?: (value: string) => Promise<void> | void;
    setTweets?: Dispatch<SetStateAction<Tweet[]>>;
}

export interface tweetsProps {
  tweets: Tweet[];
  setTweets: Dispatch<SetStateAction<Tweet[]>>;
  fetchTweets: (str?: string, sortType?: string, limit?: number, page?: number) => Promise<void> | void;
  loading: boolean;
};