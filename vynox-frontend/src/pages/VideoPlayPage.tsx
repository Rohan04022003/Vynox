/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useVideosContext } from "../context/VideosContext";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowDown, BellRing, Dot, Eye, MessageSquare, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import PlayVideoSkeleton from "../components/skeleton/PlayVideoSkeleton";
import RecommendedSkeleton from "../components/skeleton/RecommendedSkeleton";
import CommentFilter from "../components/CommentFilter";

const VideoPlayPage = () => {

  const navigation = useNavigate();

  const {
    playVideo,
    playVideoLoading,
    fetchCurrentPlayingVideo,
    fetchVideos,
    loading,
    videos,
    hasMoreVideos,
  } = useVideosContext();

  const params = useParams();

  useEffect(() => {
    if (!params?.id) return;

    fetchCurrentPlayingVideo?.(params.id);
    fetchVideos("", "desc", 20, 1);

  }, [params?.id]);// only first time load play video and all recommended videos

  // async function HandleLikeVideo(id: string) {
  //   try {

  //   } catch (error) {

  //   }
  // }

  return (
    <div className="flex items-start gap-4 w-full p-4 bg-white">

      {/* LEFT SIDE */}
      {playVideoLoading ? <PlayVideoSkeleton /> : <div className="w-[60%]">

        {/* VIDEO PLAYER */}
        <video
          src={playVideo?.videoFile?.url}
          controls
          autoPlay
          className="w-full h-[60vh] rounded-xl bg-black"
        />

        {/* TITLE */}
        <h1 className="text-neutral-700 text-xl font-semibold mt-2">
          {playVideo?.title}
        </h1>

        {/* Views / Likes / Time */}
        <div className="flex items-center justify-between text-xs text-neutral-600 mt-3">
          <div className="flex items-center gap-3">
            <p className="flex items-center gap-2 px-3 py-[2px] rounded-full bg-green-100 text-green-800 cursor-pointer">
              <ThumbsUp size={16} className="" />
              <span className="text-base">{playVideo.likeCount}</span>
            </p>
            <span className="flex items-center gap-2 px-3 py-[2px] rounded-full bg-neutral-100 text-base"><Eye size={16} className="" /> {playVideo.views}</span>
            <span className="flex items-center gap-2 px-3 py-[2px] rounded-full bg-neutral-100 text-base"><MessageSquare size={16} className="" />{playVideo?.totalComents}</span>
          </div>
          <span className="bg-neutral-100 px-3 py-2 rounded-full font-semibold">{playVideo?.createdAt &&
            formatDistanceToNow(new Date(playVideo.createdAt), { addSuffix: true })}</span>
        </div>

        {/* OWNER SECTION */}
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

          <button className="bg-red-900 hover:bg-red-800 duration-300 text-red-100 px-4 py-2 rounded-md font-semibold cursor-pointer">
            {playVideo?.isSubscribed ? <BellRing /> : "Subscribe"}
          </button>
        </div>

        {/* DESCRIPTION (Collapsible) */}
        <DescriptionBox description={playVideo?.description} />

        {/* COMMENTS */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900 mt-6">
          Comments ({playVideo?.totalComents})
        </h2>

            <CommentFilter />

        </div>

        <div className="flex flex-col gap-3 mt-4">
          {playVideo?.comments?.map((c: any) => (
            <div key={c._id} className="flex flex-col bg-neutral-100 p-2 rounded-xl">
              <div className="flex gap-2 items-center justify-between">
                <div className="flex gap-1 items-center">
                  <img
                    src={c?.owner?.[0]?.avatar?.url}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex flex-col">
                    <p className="text-neutral-900 font-semibold">
                      {c?.owner?.[0]?.fullName}
                    </p>
                    <span className="text-neutral-500 text-xs">
                      {c?.createdAt &&
                        formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <button className="flex items-center gap-1 bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-medium cursor-pointer"><ThumbsUp size={16} /> {c?.likeCount}</button>
              </div>
              <div className="mt-1">
                <p className="text-neutral-700">{c.content}</p>
              </div>
            </div>
          ))}
          <button className="flex items-center gap-1 bg-neutral-100 w-fit px-3 py-1 m-auto rounded-lg text-neutral-700 cursor-pointer">Load more comments <ArrowDown size={15} className="mt-1" /></button>
        </div>
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
                  <img src={v?.owner[0]?.avatar?.url} alt="avatar" className="w-7 h-7 rounded-full" />
                  <p className="text-neutral-700 text-sm font-medium">
                    {v.owner?.[0]?.fullName}
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
                className="flex items-center gap-1 bg-neutral-100 w-fit px-3 py-1 m-auto rounded-lg text-neutral-700 cursor-pointer"
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
