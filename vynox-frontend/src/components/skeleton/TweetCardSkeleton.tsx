const TweetCardSkeleton = () => {
    return (
        <div className="border border-neutral-300 shadow-lg w-full p-2 rounded-lg animate-pulse">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-full bg-neutral-200"></div>
                <div className="flex flex-col gap-1">
                    <div className="h-3 w-24 bg-neutral-200 rounded"></div>
                    <div className="h-2 w-10 bg-neutral-200 rounded"></div>
                </div>
            </div>
            <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
            <div className="w-full h-32 bg-neutral-200 rounded-sm"></div>
            <div className="flex items-center justify-between mt-3 w-full">
                <div className="h-7 w-16 bg-neutral-200 rounded-full"></div>
                <div className="h-7 w-20 bg-neutral-200 rounded-full"></div>
            </div>
        </div>
    );
};

export default TweetCardSkeleton;
