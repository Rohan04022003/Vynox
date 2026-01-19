/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import type { Video, VideosContextType } from "../types";
import toast from "react-hot-toast";
import { useUser } from "./userContext";


const VideosContext = createContext<VideosContextType | undefined>(undefined);

export const VideosProvider = ({ children }: { children: ReactNode }) => {

  const { user } = useUser(); // getting user data.

  const [playVideo, setPlayVideo] = useState({})
  const [playVideoLoading, setPlayVideoLoading] = useState(false)
  const [videos, setVideos] = useState<Video[]>([]); // yeh useState vidoes ko hold karega.
  const [comments, setComments] = useState<any>([]); // yeh useState vidoes ko hold karega.
  const [loading, setLoading] = useState(false); // yeh loading screen ke liye bana hai.
  const [commentLoading, setCommentLoading] = useState(false); // yeh loading screen ke liye bana hai.
  const [page, setPage] = useState<number>(1); // yeh by default page 1 karega.
  const [hasMoreVideos, setHasMoreVideos] = useState(true); // iska use hamne aur content next page pe hai ya nahi uske liye use kiya hai.
  const [hasMoreComments, setHasMoreCommets] = useState(true); // iska use hamne aur content next page pe hai ya nahi uske liye use kiya hai.
  const [commentPage, setCommentPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0)
  const [videoLikeLoader, setVideoLikeLoader] = useState<boolean>(false)
  // comments part starts here.
  const [commentAddLoader, setCommentAddLoader] = useState<boolean>(false)
  const [addComment, setAddComment] = useState<string>("");
  const [commentUpdateLoader, setCommentUpdateLoader] = useState<boolean>(false);
  const [editComment, setEditComment] = useState<{
    id: string;
    content: string;
  }>({ id: "", content: "" });
  const [CommentLikeLoaderId, setCommentLikeLoaderId] = useState<string>("")
  const [commentDeleteLoaderId, setCommentDeleteLoaderId] = useState<string>("")



  const fetchVideos = async ( // videos ko fetch karega yeh method.
    str = "",
    sortType = "desc",
    limit = 10,
    newPage?: number
  ) => {
    const pageToFetch = newPage ?? page; // yeh hamare current page number ko set krega.

    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/videos`, // yeh videos ka acutal url hai.
        {
          params: { query: str, sortType, limit, page: pageToFetch }, // query hai videos ko fetch krne ke liye.
          withCredentials: true,
        }
      );

      const fetchedVideos: Video[] = res.data?.data?.videos ?? []; // yaha pe fetchedVideos me woh filterd aur fetched videos aayenge.

      if (newPage) {
        setVideos(fetchedVideos); // videos ko setVideos me set kiya hai.
        setPage(2);
        setHasMoreVideos(fetchedVideos.length === limit); // yeh check krega ki aur content hai ya nahi means next page.
      } else {
        setVideos(prev => [...prev, ...fetchedVideos]); // next page ke content ko aad kiya hai.
        setPage(pageToFetch + 1);
        setHasMoreVideos(fetchedVideos.length === limit); // yeh check krega ki aur content hai ya nahi means next page.
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikedVideos = async ( // liked videos ko fetch karega yeh method.
    sortType = "desc",
    limit = 10,
    newPage?: number
  ) => {
    const pageToFetch = newPage ?? page; // yeh hamare current page number ko set krega.

    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/videos/user/liked`,
        {
          params: { sortType, limit, page: pageToFetch },
          withCredentials: true,
        }
      );

      const fetchedVideos: Video[] = res.data?.data?.videos ?? []; // yaha pe fetchedVideos me woh filterd aur fetched videos aayenge.

      if (newPage) {
        setVideos(fetchedVideos); // videos ko setVideos me set kiya hai.
        setPage(2);
        setHasMoreVideos(fetchedVideos.length === limit); // yeh check krega ki aur content hai ya nahi means next page.
      } else {
        setVideos(prev => [...prev, ...fetchedVideos]); // next page ke content ko aad kiya hai.
        setPage(pageToFetch + 1);
        setHasMoreVideos(fetchedVideos.length === limit); // yeh check krega ki aur content hai ya nahi means next page.
      }
    } catch (error) {
      console.error("Error fetching liked videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommentedVideos = async ( // commented videos ko fetch karega yeh method.
    sortType = "desc",
    limit = 10,
    newPage?: number
  ) => {
    const pageToFetch = newPage ?? page; // yeh hamare current page number ko set krega.

    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/videos/user/commented`,
        {
          params: { sortType, limit, page: pageToFetch },
          withCredentials: true,
        }
      );

      const fetchedVideos: Video[] = res.data?.data?.videos ?? []; // yaha pe fetchedVideos me woh filterd aur fetched videos aayenge.

      if (newPage) {
        setVideos(fetchedVideos); // videos ko setVideos me set kiya hai.
        setPage(2);
        setHasMoreVideos(fetchedVideos.length === limit); // yeh check krega ki aur content hai ya nahi means next page.
      } else {
        setVideos(prev => [...prev, ...fetchedVideos]); // next page ke content ko aad kiya hai.
        setPage(pageToFetch + 1);
        setHasMoreVideos(fetchedVideos.length === limit); // yeh check krega ki aur content hai ya nahi means next page.
      }
    } catch (error) {
      console.error("Error fetching Commented videos:", error);
    } finally {
      setLoading(false);
    }
  };

  // current playing video ko fetch krega.
  const fetchCurrentPlayingVideo = async (videoId?: string) => {
    if (!videoId) return;
    try {

      setPlayVideoLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/videos/${videoId}`, // yeh current playing video ka data dega.
        { withCredentials: true },
      );

      const fetchedVideo = res.data?.data[0] || {};
      setPlayVideo(fetchedVideo);

    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setPlayVideoLoading(false)
    }

  }

  // yeh current playing video ke comments ko fetch krega.
  const fetchCurrentPlayingVideoComments = async (
    videoId?: string,
    pageToFetch = 1,
    limit = 10
  ) => {
    if (!videoId) return;

    try {
      setCommentLoading(true);

      const res: any = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/comments/${videoId}`,
        {
          params: { limit, page: pageToFetch },
          withCredentials: true,
        }
      );

      const fetchedComments = res.data?.data?.comments ?? [];
      setTotalComments(res.data?.data?.totalComments)

      if (pageToFetch === 1) {
        setComments(fetchedComments);
      } else {
        setComments((prev: any[]) => [...prev, ...fetchedComments]);
      }

      setCommentPage(pageToFetch + 1);
      setHasMoreCommets(fetchedComments.length === limit);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleLikeVideo = async (videoId: string) => {
    try {
      setVideoLikeLoader(true)

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/likes/toggle/v/${videoId}`, {}, { withCredentials: true })

      if (response.status === 200) {
        setPlayVideo((prev: any) => {

          if (!prev) return;

          const isLiked = prev.isLiked;

          return {
            ...prev,
            likeCount: isLiked ? prev.likeCount - 1 : prev.likeCount + 1, // agar isLiked true hai toh 1 kam nahi to 1 jyada.
            isLiked: !isLiked,
          };
        })
      }

    } catch (error) {
      console.log("Video like Failed: ", error)
    } finally {
      setVideoLikeLoader(false)
    }
  }

  // comment part starts here.
  const handleAddComment = async (videoId: string) => {
    try {
      setCommentAddLoader(true);

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/comments/${videoId}`,
        {
          content: addComment
        },
        {
          withCredentials: true
        }
      )

      if (response.status === 200) {
        await fetchCurrentPlayingVideoComments?.(videoId, 1, 10);
        setAddComment("")
        toast.success("Comment added.")
      } else {
        setAddComment("")
        toast.error("Comment added unsuccessfull.")
      }

    } catch (error) {
      console.log("Comment add Failed: ", error)
      toast.error("Comment added Failed.")
    } finally {
      setCommentAddLoader(false)
    }
  }

  const handleCommentUpdate = async (commentId: string) => {
    try {
      setCommentUpdateLoader(true);

      const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}/comments/c/${commentId}`,
        {
          content: editComment.content
        },
        {
          withCredentials: true
        }
      )

      if (response.status === 200) {
        // yeh frequent update ke liye hai on frontend.
        setComments((prev: any[]) => prev.map(c =>
          c._id === commentId ?
            {
              ...c,
              content: editComment.content,
              isEdited: true
            } : c
        )
        )
        setEditComment({ id: "", content: "" });
        toast.success("Comment was Updated.")

      } else {
        setEditComment({ id: "", content: "" });
      }

    } catch (error) {
      toast.error("Comment Updation Failed.")
      console.log("Comment Update Failed: ", error)
      setEditComment({ id: "", content: "" });
    } finally {
      setCommentUpdateLoader(false)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    try {
      setCommentLikeLoaderId(commentId);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/likes/toggle/c/${commentId}`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        setComments((prev: any[]) => {
          if (!Array.isArray(prev)) return prev;

          return prev.map((comment) => { // because yeh array hai.
            if (comment._id !== commentId) return comment;

            const isLiked = comment.isLikedByCurrentUser;

            return {
              ...comment,
              totalLikes: isLiked
                ? comment.totalLikes - 1
                : comment.totalLikes + 1,
              isLikedByCurrentUser: !isLiked,
              likedUsers: isLiked ? comment.likedUsers.filter((u: any) => u._id !== user._id)
                : [...comment.likedUsers, { _id: user._id, avatar: { url: user.avatar.url, public_id: user.avatar.public_id } }]
            };
          });
        });

      }
    } catch (error) {
      console.log("Comment like failed:", error);
    } finally {
      setCommentLikeLoaderId("");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      setCommentDeleteLoaderId(commentId);

      const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/comments/c/${commentId}`, { withCredentials: true })

      if (response.status === 200) {
        setComments((prev: any[]) =>
          Array.isArray(prev)
            ? prev.filter((c) => c._id !== commentId)
            : prev
        );

        toast.success("Comment was Deleted.")
      }

    } catch (error) {
      console.log("Comment deletion Failed: ", error)
      toast.error("Comment delete unsuccessfull.")
    } finally {
      setCommentDeleteLoaderId("")
    }
  }

  return (
    <VideosContext.Provider
      value={{
        videos,
        loading,
        hasMoreVideos,
        fetchVideos,
        setVideos,
        playVideo,
        setPlayVideo,
        playVideoLoading,
        fetchCurrentPlayingVideo,
        comments,
        setComments,
        page,
        commentLoading,
        hasMoreComments,
        fetchCurrentPlayingVideoComments,
        commentPage,
        setCommentPage,
        totalComments,
        fetchLikedVideos,
        fetchCommentedVideos,
        handleLikeVideo,
        videoLikeLoader,
        // comments part
        handleAddComment,
        addComment,
        setAddComment,
        commentAddLoader,
        handleCommentUpdate,
        commentUpdateLoader,
        setEditComment,
        editComment,
        handleLikeComment,
        CommentLikeLoaderId,
        handleDeleteComment,
        commentDeleteLoaderId
      }}
    >
      {children}
    </VideosContext.Provider>
  );
};


export const useVideosContext = () => {
  const context = useContext(VideosContext);
  if (!context) {
    throw new Error("useVideosContext must be used within a VideosProvider");
  }
  return context;
};
