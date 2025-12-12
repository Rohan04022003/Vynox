const RecommendedSkeleton = () => {
  return (
    <div className="w-[40%] h-screen bg-white overflow-y-auto pr-2">

      {/* HEADING */}
      <div className="mb-3">
        <Skeleton className="h-6 w-40 rounded-md" />
      </div>

      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex gap-3 p-2 rounded-lg animate-pulse"
          >
            {/* THUMBNAIL */}
            <Skeleton className="w-44 h-24 rounded-lg" />

            {/* DETAILS */}
            <div className="flex flex-col gap-2 flex-1">

              {/* TITLE */}
              <Skeleton className="h-4 w-[80%] rounded-md" />
              <Skeleton className="h-4 w-[60%] rounded-md" />

              {/* CHANNEL */}
              <div className="flex items-center gap-2 mt-1">
                <Skeleton className="w-7 h-7 rounded-full" />
                <Skeleton className="h-3 w-28 rounded-md" />
              </div>

              {/* VIEWS + TIME */}
              <Skeleton className="h-3 w-36 rounded-md" />

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default RecommendedSkeleton;

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-neutral-200 ${className}`} />
);
