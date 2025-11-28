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
