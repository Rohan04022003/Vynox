/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Dispatch, SetStateAction } from "react";

// videosTypes

export interface Owner {
  _id: string;
  username?: string;
  fullName: string;
  avatar?: { url: string; public_id: string };
}

export interface Video {
  _id: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  likeCount: number;
  isPublished: boolean;
  videoFile: { url: string; public_Id: string };
  thumbnail: { url: string; public_Id: string };
  owner: Owner[];
  createdAt: string;
}

export interface VideosContextType {
  page: number;
  playVideo: any
  comments: any
  videos: Video[];
  loading: boolean;
  playVideoLoading: boolean
  commentLoading: boolean
  hasMoreVideos: boolean;
  hasMoreComments: boolean;
  fetchVideos: (
    str: string,
    sortType?: string,
    limit?: number,
    newPage?: number
  ) => Promise<void>;
  fetchCurrentPlayingVideo?: (videoId?: string) => Promise<void>
  fetchCurrentPlayingVideoComments?: (videoId?: string, limit?: number, newPage?: number) => Promise<void>
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  commentPage: number
  setCommentPage: React.Dispatch<React.SetStateAction<number>>;
  totalComments: number
}

// tweetTypes
export interface TweetOwner {
  _id: string;
  avatar?: { url?: string };
  username?: string;
}

export interface Tweet {
  createdAt: string | number | Date;
  _id: string;
  owner?: TweetOwner[];
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
  hasMoreTweets: boolean;
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
  search: string;
  setSearch: (v: string) => void;
  tagSearch: string;
  setTagSearch: (v: string) => void;
  sortType: string;
  setSortType: (v: string) => void;
  limit: number;
  setLimit: (v: number) => void;
  fetchTweets?: (q: string, sortType: string, limit: number, page?: number) => Promise<void>;
  setTweets?: React.Dispatch<React.SetStateAction<Tweet[]>>;
  fetchVideos?: (q: string, sortType: string, limit: number, page?: number) => Promise<void>;
  setVideos?: React.Dispatch<React.SetStateAction<Video[]>>;
};
