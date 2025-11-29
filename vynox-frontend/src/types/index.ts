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

export interface TweetsContextType {
  tweets: Tweet[];
  setTweets: React.Dispatch<React.SetStateAction<Tweet[]>>;
  loading: boolean;
  fetchTweets: (
    str?: string,
    sortType?: string,
    limit?: number,
    newPage?: number
  ) => Promise<void>;
  hasMore: boolean;
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
  setSearch?: Dispatch<SetStateAction<string>>;
  search?: string;
  setTagSearch?: Dispatch<SetStateAction<string>>;
}

export interface tweetsProps {
  setSearch: Dispatch<SetStateAction<string>>;
  search: string;
  setTagSearch: Dispatch<SetStateAction<string>>;
  tagSearch: string;
};

export interface FilterBarProps {
    setSearch: (v: string) => void;
    tagSearch: string;
    setTagSearch: (v: string) => void;
    sortType: string;
    setSortType: (v: string) => void;
    limit: number;
    setLimit: (v: number) => void;
    fetchTweets: (q: string, sortType: string, limit: number, page?: number) => Promise<void>;
    setTweets: React.Dispatch<React.SetStateAction<Tweet[]>>;
};
