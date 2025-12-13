 
const PlayVideoSkeleton = () => {
    return (
        <div className="w-[60%]">

            {/* VIDEO PLAYER */}
            <Skeleton className="w-full h-[60vh] rounded-xl mb-4" />

            {/* TITLE */}
            <Skeleton className="h-6 w-[70%] rounded-md" />

            {/* Views / Likes / Time */}
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-20 rounded-full" />
                    <Skeleton className="h-8 w-16 rounded-full" />
                    <Skeleton className="h-8 w-16 rounded-full" />
                </div>
                <Skeleton className="h-8 w-32 rounded-full" />
            </div>

            {/* OWNER SECTION */}
            <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-32 rounded-md" />
                        <Skeleton className="h-3 w-24 rounded-md" />
                    </div>
                </div>
                <Skeleton className="h-10 w-28 rounded-md" />
            </div>

            {/* DESCRIPTION */}
            <div className="mt-6">
                <Skeleton className="h-4 w-full mb-2 rounded-md" />
                <Skeleton className="h-4 w-[90%] mb-2 rounded-md" />
                <Skeleton className="h-4 w-[80%] rounded-md" />
            </div>

        </div>
    );
};



export default PlayVideoSkeleton;

const Skeleton = ({ className }: { className: string }) => (
    <div className={`animate-pulse bg-neutral-200 ${className}`} />
);
