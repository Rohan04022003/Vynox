/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useVideosContext } from "../context/VideosContext";
import { useParams } from "react-router-dom";
import { Eye, MessageSquare, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const VideoPlayPage = () => {

  const {
    playVideo,
    playVideoLoading,
    fetchCurrentPlayingVideo,
    fetchVideos,
    loading,
    videos,
    hasMore
  } = useVideosContext();

  const params = useParams();

  useEffect(() => {
    if (!params?.id) return;

    fetchCurrentPlayingVideo(params.id);
    fetchVideos("", "desc", 20, 1);

  }, []);// only first time

  console.log(playVideo)

  return (
    <div className="flex items-start gap-4 w-full p-4 bg-white">

      {/* LEFT SIDE */}
      <div className="w-[60%]">

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
              <p className="text-neutral-900 text-lg font-semibold">
                {playVideo?.owner?.[0]?.username}
              </p>
              <p className="text-neutral-500 text-sm">
                {playVideo?.totalSubscribers} subscribers
              </p>
            </div>
          </div>

          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold">
            {playVideo?.isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>

        {/* DESCRIPTION (Collapsible) */}
        <DescriptionBox description={playVideo?.description} />

        {/* COMMENTS */}
        <h2 className="text-xl font-semibold text-neutral-900 mt-6">
          Comments ({playVideo?.totalComents})
        </h2>

        <div className="flex flex-col gap-5 mt-4">
          {playVideo?.comments?.map((c: any) => (
            <div key={c._id} className="flex gap-3">
              <img
                src={playVideo?.owner?.[0]?.avatar?.url}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-neutral-900 font-semibold">
                  {playVideo?.owner?.[0]?.username}
                </p>
                <p className="text-neutral-700">{c.content}</p>
                <span className="text-neutral-500 text-xs">
                  {c?.createdAt &&
                    formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-[40%] h-screen bg-white">
        {/* You will add your content here */}
      </div>

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
          className="text-blue-600 font-semibold mt-2"
        >
          {open ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};


export default VideoPlayPage;
