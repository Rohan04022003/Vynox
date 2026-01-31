export function ProfileSkeleton() {
    return (
        <div className="min-h-screen w-full lg:px-30 pt-5 bg-[#f9f9f9] animate-pulse">
            {/* ---------------- Cover Skeleton ---------------- */}
            <div className="relative h-48 sm:h-64 w-full bg-gray-300 rounded-2xl">
                {/* Avatar */}
                <div className="absolute -bottom-14 left-4 sm:left-8">
                    <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full bg-gray-200 border-4 border-white" />
                </div>
            </div>

            {/* ---------------- Profile Info Skeleton ---------------- */}
            <div className="px-4 sm:px-8 pt-16 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                    {/* Left */}
                    <div className="space-y-3">
                        <div className="h-6 w-48 bg-gray-300 rounded" />
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                        <div className="h-4 w-80 bg-gray-200 rounded" />
                        <div className="h-4 w-64 bg-gray-200 rounded" />
                    </div>

                    {/* Right Buttons */}
                    <div className="flex gap-3">
                        <div className="h-9 w-28 bg-gray-200 rounded-full" />
                        <div className="h-9 w-36 bg-gray-200 rounded-full" />
                    </div>
                </div>

                {/* ---------------- Stats Skeleton ---------------- */}
                <div className="mt-6 flex flex-wrap gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-5 w-24 bg-gray-200 rounded-full"
                        />
                    ))}
                </div>

                {/* ---------------- Meta Skeleton ---------------- */}
                <div className="mt-4 space-y-2">
                    <div className="h-4 w-48 bg-gray-200 rounded" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>

                {/* ---------------- Social Links Skeleton ---------------- */}
                <div className="mt-6 flex gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-9 w-24 bg-gray-200 rounded-full"
                        />
                    ))}
                </div>

                {/* ---------------- Tabs Skeleton ---------------- */}
                <div className="mt-10 border-b flex gap-6">
                    <div className="h-4 w-20 bg-gray-300 rounded" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    );
}
