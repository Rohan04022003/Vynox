/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useVideosContext } from "../context/VideosContext";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowDown, ThumbsUp, BellRing, Dot, Edit, Eye, MessageSquare, Trash, Loader } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import PlayVideoSkeleton from "../components/skeleton/PlayVideoSkeleton";
import RecommendedSkeleton from "../components/skeleton/RecommendedSkeleton";
import CommentsSkeleton from "../components/skeleton/CommentsSkeleton";
import { useUser } from "../context/userContext";
import axios from "axios";
import toast from "react-hot-toast";

const VideoPlayPage = () => {

  const navigation = useNavigate();
  const { user } = useUser();

  const {
    playVideo,
    setPlayVideo,
    playVideoLoading,
    fetchCurrentPlayingVideo,
    fetchVideos,
    loading,
    videos,
    hasMoreVideos,
    hasMoreComments,
    comments,
    setComments,
    commentLoading,
    fetchCurrentPlayingVideoComments,
    commentPage,
    setCommentPage,
    totalComments
  } = useVideosContext();

  const params = useParams();
  const [limit, setLimit] = useState<number>(10);
  const [editComment, setEditComment] = useState<{
    id: string;
    content: string;
  }>({ id: "", content: "" });
  const [commentUpdateLoader, setCommentUpdateLoader] = useState<boolean>(false)
  const [addComment, setAddComment] = useState<string>("");
  const [commentAddLoader, setCommentAddLoader] = useState<boolean>(false)
  const [videoLikeLoader, setVideoLikeLoader] = useState<boolean>(false)
  const [CommentLikeLoader, setCommentLikeLoader] = useState<string>("")
  const [commentDeleteLoader, setCommentDeleteLoader] = useState<string>("")
  const [subscribeLoader, setSubscribeLoader] = useState<boolean>(false)

  // currenct playing video load
  useEffect(() => {
    if (!params?.id) return;
    fetchCurrentPlayingVideo?.(params.id);
  }, [params?.id]);

  // Recommended videos ko ek bar load kiya hai
  useEffect(() => {
    fetchVideos("", "desc", 20, 1);
  }, []);

  // Sync comments.
  useEffect(() => {
    if (!params?.id) return;
    setCommentPage(1);
    fetchCurrentPlayingVideoComments?.(params.id, 1, limit);
  }, [params?.id, limit]);

  // yeh views count ke liye function hai.
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/videos/${params?.id}/view`,
          {},
          { withCredentials: true }
        );

        if (response.status === 201) {
          setPlayVideo((prev: any) => {
            if (!prev) return prev;

            return {
              ...prev,
              views: prev.views + 1,
            };
          });
        }
      } catch (error) {
        console.log("Video view failed:", error);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [params?.id]);

  // yeh watche history create krega.
  useEffect(() => {
    const watchedHistoryCreate = async () => {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/videos/${params?.id}/history`,
        {},
        { withCredentials: true }
      );
    }

    watchedHistoryCreate();

  }, [params?.id])

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

  // yaha se comments ki logic start hota hai like CRUD.
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
      } else {
        setEditComment({ id: "", content: "" });
      }

    } catch (error) {
      console.log("Comment Update Failed: ", error)
      setEditComment({ id: "", content: "" });
    } finally {
      setCommentUpdateLoader(false)
    }
  }

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
        await fetchCurrentPlayingVideoComments?.(videoId, 1, limit);
        setAddComment("")
        toast.success("Comment added.")
      } else {
        setAddComment("")
        toast.error("Comment added unsuccessfull.")
      }

    } catch (error) {
      console.log("Comment add Failed: ", error)
      toast.error("Comment added unsuccessfull.")
    } finally {
      setCommentAddLoader(false)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    try {
      setCommentLikeLoader(commentId);

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
            console.log({ ...comment })
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
      setCommentLikeLoader("");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      setCommentDeleteLoader(commentId);

      const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/comments/c/${commentId}`, { withCredentials: true })

      if (response.status === 200) {
        setComments((prev: any[]) =>
          Array.isArray(prev)
            ? prev.filter((c) => c._id !== commentId)
            : prev
        );
      }

    } catch (error) {
      console.log("Comment deletion Failed: ", error)
      toast.error("Comment delete unsuccessfull.")
    } finally {
      setCommentDeleteLoader("")
    }
  }

  const handleEditCommentClick = (commentId: string, content: string) => {
    setEditComment({ id: commentId, content });
  };

  const handleCancelCommentClick = () => {
    setEditComment({ id: "", content: "" });
  }

  // ____________________________________________________________

  // channel subscription function 
  const handleSubscribe = async (channelId: string) => {
    try {
      setSubscribeLoader(true)

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/subscriptions/c/${channelId}`, {}, { withCredentials: true })

      if (response.status === 200) {
        setPlayVideo((prev: any) => {

          if (!prev) return;

          const isSubscribed = prev.isSubscribed;

          return {
            ...prev,
            totalSubscribers: isSubscribed ? prev.totalSubscribers - 1 : prev.totalSubscribers + 1, // agar isSubscribed true hai toh 1 kam nahi to 1 jyada.
            isSubscribed: !isSubscribed,

          };
        })
      }

    } catch (error) {
      console.log("Subscribe toggle failed:", error);
    } finally {
      setSubscribeLoader(false)
    }
  }

  return (
    <div className="flex items-start gap-4 w-full p-4 bg-white">

      {/* LEFT SIDE */}
      {playVideoLoading ? <PlayVideoSkeleton /> : <div className="w-[60%]">

        {/* Video Player */}
        <video
          src={playVideo?.videoFile?.url}
          controls
          autoPlay
          className="w-full h-[60vh] rounded-xl bg-black"
        />

        {/* Title */}
        <h1 className="text-neutral-700 text-xl font-semibold mt-2">
          {playVideo?.title}
        </h1>

        {/* Views / Likes / Time */}
        <div className="flex items-center justify-between text-xs text-neutral-600 mt-3">
          <div className="flex items-center gap-3">
            <button onClick={() => params?.id && handleLikeVideo(params?.id)} className={`flex items-center justify-center gap-2 px-3 h-7 rounded-full ${playVideo?.isLiked ? "bg-green-600 text-white" : "bg-green-100 text-green-800"} cursor-pointer`}>
              <ThumbsUp size={16} className="" />
              {videoLikeLoader ? <Loader size={16} className="animate-spin" /> : <span className="text-base">{playVideo.likeCount}</span>}
            </button>
            <span className="flex items-center justify-center gap-2 px-3 h-7 rounded-full bg-neutral-100 text-base"><Eye size={16} className="" /> {playVideo.views}</span>
            <span className="flex items-center justify-center gap-2 px-3 h-7 rounded-full bg-neutral-100 text-base"><MessageSquare size={16} className="" />{totalComments}</span>
          </div>
          <span className="bg-neutral-100 px-3 py-2 rounded-full font-semibold">{playVideo?.createdAt &&
            formatDistanceToNow(new Date(playVideo.createdAt), { addSuffix: true })}</span>
        </div>

        {/* Owner Section */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <img
              src={playVideo?.owner?.[0]?.avatar?.url}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="text-neutral-900 text-lg font-semibold -mt-2">
                {playVideo?.owner?.[0]?.username}
              </p>
              <p className="text-neutral-500 text-xs font-medium">
                {playVideo?.totalSubscribers} subscribers
              </p>
            </div>
          </div>

          <button
            onClick={() => handleSubscribe(playVideo?.owner?.[0]?._id)}
            className={`bg-red-900 hover:bg-red-800 duration-300 text-red-100 text-xs px-3 py-2 rounded-md font-semibold cursor-pointer ${playVideo?.owner?.[0]?._id === user._id ? "hidden" : "flex"}`}>
            {subscribeLoader ? <Loader size={18} className="animate-spin" /> : playVideo?.isSubscribed ? <BellRing size={18} /> : "Subscribe"}
          </button>
        </div>

        {/* Description collapsible hai */}
        <DescriptionBox description={playVideo?.description} />

        {/* Add Comment  */}
        <div className={`relative mt-5 w-full items-center gap-2 ${editComment.id ? "hidden" : "flex"}`}>
          <textarea
            value={addComment}
            onChange={(e) => setAddComment(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Leave a Comment."
            className=" resize-none w-full px-3 py-1 border text-base border-neutral-400 rounded-md outline-none" />
          <button disabled={addComment.length < 1} onClick={() => params?.id && handleAddComment(params?.id)} className="absolute bottom-1 right-1 px-2 py-1 flex items-center gap-1 rounded-sm bg-green-200 text-xs text-green-800 cursor-pointer">
            {commentAddLoader ? <Loader size={14} className="animate-spin" /> : "Comment"}
          </button>
        </div>

        {/* COMMENTS */}
        <div className="flex items-center justify-between mt-4">
          <h2 className="text-xl font-semibold text-neutral-900">
            {`Comments (${totalComments})`}
          </h2>

          {/* yeh comments ko filter karne ke liye hai  */}
          <div className='relative'>
            <select
              className="px-3 py-1 border border-neutral-300 rounded-md outline-none text-xs cursor-pointer text-neutral-700"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              <option value={1}>1 Comments</option>
              <option value={10}>10 Comments</option>
              <option value={15}>15 Comments</option>
              <option value={20}>20 Comments</option>
            </select>
          </div>

        </div>

        <div className="flex flex-col gap-3 mt-4 mb-10">
          {comments.map((c: any) => (
            <div
              key={c._id}
              className="flex flex-col bg-neutral-100 p-2 rounded-xl relative"
            >
              <div className="flex gap-2 items-start justify-between">
                {/* LEFT */}
                <div className="flex gap-1 items-center">
                  <img
                    src={c.owner?.avatar?.url}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  {c.isEdited ? <Edit size={18} className="text-xs text-orange-800 bg-orange-100 p-1 rounded-full absolute top-8 left-8" /> : ""}

                  <div className="flex flex-col">
                    <p className="text-neutral-900 font-semibold">
                      @{c.owner?.username}
                    </p>
                    <span className="text-neutral-500 text-xs">
                      {c.createdAt && formatDistanceToNow(c.createdAt)
                      }
                    </span>
                  </div>
                </div>

                {/* right avatar + likes */}
                <div className="flex items-center gap-2">
                  {/* Overlapping Avatars */}
                  {c.likedUsers?.length > 0 && (
                    <div className="flex -space-x-2">
                      {c.likedUsers.slice(0, 3).map((u: any, i: number) => (
                        <img
                          key={i}
                          src={u.avatar?.url}
                          className="w-6 h-6 rounded-full border-2 border-neutral-100 object-cover"
                        />
                      ))}
                    </div>
                  )}

                  {/* video Like Button */}
                  <button
                    onClick={() => handleLikeComment(c._id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${c.isLikedByCurrentUser
                      ? "bg-green-600 text-white"
                      : "bg-green-200 text-green-800"
                      }`}
                  >
                    <ThumbsUp size={14} />
                    {CommentLikeLoader === c._id ? <Loader size={14} className="animate-spin" /> : c.totalLikes}
                  </button>
                  <button onClick={() => handleEditCommentClick(c._id, c.content)} className={`text-orange-700 text-xs items-center gap-1 px-2 py-1 bg-orange-200 rounded-full cursor-pointer ${user?._id === c?.owner?._id && !(editComment.id === c._id) ? "flex" : "hidden"}`}><Edit size={14} /></button>
                  <button onClick={() => handleDeleteComment(c._id)} className={`text-red-700 text-xs items-center gap-1 px-2 py-1 bg-red-200 rounded-full cursor-pointer ${user?._id === c?.owner?._id ? "flex" : "hidden"}`}>{commentDeleteLoader === c._id ? <Loader size={14} className="animate-spin" /> : <Trash size={14} />}</button>
                </div>
              </div>

              {/* COMMENT TEXT */}
              <div className="mt-2 space-y-2">
                <p className={`text-neutral-700 text-base ${editComment.id === c._id ? "hidden" : "flext"}`}>{c.content}</p>
                <textarea
                  disabled={editComment.id === c._id ? false : true}
                  onChange={(e) =>
                    setEditComment((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  value={editComment.content}
                  rows={3}
                  className={`${editComment.id === c._id ? "flex" : "hidden"} w-full resize-none rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-700 bg-neutral-50 focus:outline-none`} />

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleCommentUpdate(c?._id)}
                    disabled={editComment.content === c.content ? true : false}
                    className={`px-4 py-1.5 text-sm font-medium text-green-800 bg-green-200 rounded-md transition ${editComment.id === c._id ? "flex" : "hidden"} ${editComment.id === c.content ? "cursor-not-allowed" : "cursor-pointer hover:bg-green-700 hover:text-white"}`}>
                    {
                      commentUpdateLoader ? <Loader size={20} className="animate-spin" /> : "Update"
                    }
                  </button>

                  <button
                    onClick={handleCancelCommentClick}
                    className={`px-4 py-1.5 text-sm font-medium cursor-pointer text-red-800 bg-red-200 rounded-md hover:bg-red-700 hover:text-white transition ${editComment.id === c._id ? "flex" : "hidden"}`}>
                    Cancel
                  </button>
                </div>
              </div>

            </div>
          ))}

          {/* Load More Button */}
          {hasMoreComments && !loading && comments.length !== 0 && !commentLoading && (
            <div className="flex justify-center mt-5 mb-10">
              <button
                className="flex items-center gap-1 bg-neutral-100 w-fit px-3 py-1 m-auto rounded-lg text-neutral-700 cursor-pointer"
                onClick={() =>
                  fetchCurrentPlayingVideoComments?.(
                    params?.id,
                    commentPage,
                    limit
                  )
                }
              >
                Load More Comments <ArrowDown size={15} className="mt-1" />
              </button>
            </div>
          )}
        </div>

        {commentLoading && <CommentsSkeleton />}

        {!commentLoading && comments.length === 0 && (
          <p className="text-center text-neutral-500 mt-4">
            No comments yet
          </p>
        )}


      </div>}

      {/* RIGHT SIDE */}
      {loading ? <RecommendedSkeleton /> : <div className="w-[40%] h-screen bg-white overflow-y-auto pr-2">

        <h2 className="text-lg font-semibold text-neutral-900 mb-3">
          Recommended Videos
        </h2>

        <div className="flex flex-col gap-2">
          {videos?.map((v: any) => (v._id !== params.id &&
            <div
              onClick={() => navigation(`/video/${v._id}`)}
              key={v._id}
              className="flex gap-3 cursor-pointer hover:bg-neutral-100 p-2 rounded-lg transition"
            >
              {/* THUMBNAIL */}
              <div className="w-44 h-24 overflow-hidden rounded-lg">
                <img
                  src={v.thumbnail.url}
                  className="w-full h-full object-cover"
                  alt={v.title}
                />
              </div>

              {/* DETAILS */}
              <div className="flex flex-col justify-start gap-1">

                {/* TITLE */}
                <p className="text-neutral-800 font-semibold line-clamp-2">
                  {v.title.length > 50 ? v.title.slice(0, 50) + "..." : v.title}
                </p>

                {/* CHANNEL */}
                <div className="flex items-center gap-2 rounded-full mb-1">
                  <img src={v?.owner?.avatar?.url} alt="avatar" className="w-7 h-7 rounded-full" />
                  <p className="text-neutral-700 text-sm font-medium">
                    {v.owner?.fullName}
                  </p>
                </div>

                {/* VIEWS + DATE */}
                <p className="flex items-center text-neutral-400 text-xs">
                  {v.views} views <Dot size={20} />{" "}
                  {v.createdAt &&
                    formatDistanceToNow(new Date(v.createdAt), { addSuffix: true })}
                </p>
              </div>

            </div>
          ))}
          {/* Load More Button */}
          {hasMoreVideos && !loading && videos.length !== 0 && (
            <div className="flex justify-center mt-5">
              <button
                className="flex items-center gap-1 bg-neutral-200 w-fit px-3 py-1 m-auto rounded-lg text-neutral-700 cursor-pointer"
                onClick={() => fetchVideos("", "desc", 20, 1)}
              >
                Load More Videos <ArrowDown size={15} className="mt-1" />
              </button>
            </div>
          )}
        </div>

      </div>}


    </div>

  );
};

const DescriptionBox = ({ description }: { description: string }) => {
  const [open, setOpen] = useState(false);

  const shortText =
    description?.length > 130 ? description.substring(0, 130) + "..." : description;

  return (
    <div className="bg-neutral-100 p-4 rounded-xl mt-5 text-neutral-800">
      <h3 className="text-sm pb-2 font-semibold">Description</h3>
      <p>{open ? description : shortText}</p>

      {description?.length > 130 && (
        <button
          onClick={() => setOpen(!open)}
          className="text-neutral-700 font-semibold mt-2 text-xs bg-neutral-200 px-3 py-1 rounded-xl cursor-pointer"
        >
          {open ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};


export default VideoPlayPage;
