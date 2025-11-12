import vynox from "../../assets/vynox.png"

const VideoCardSkeleton = () => {
  return (
    <div
      className="
        w-full max-w-[320px] 
        bg-white 
        rounded-lg 
        shadow-md 
        overflow-hidden 
        animate-pulse
      "
    >
      <div className="w-full flex items-center justify-center h-28 sm:h-32 bg-neutral-200">
        <img src={vynox} alt="vynox-for-loading" className="w-15 opacity-30" />
      </div>


      <div className="p-2 flex flex-col gap-1">
        <div className="h-4 bg-neutral-200 rounded w-3/4"></div>

        <div className="flex items-center gap-2 mt-1">
          <div className="w-7 h-7 rounded-full bg-neutral-200"></div>
          <div className="h-3 w-1/3 bg-neutral-200 rounded"></div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 bg-neutral-200 rounded-full"></div>
            <div className="h-4 w-12 bg-neutral-200 rounded-full"></div>
          </div>
          <div className="h-3 w-10 bg-neutral-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoCardSkeleton;
