/* eslint-disable react-hooks/rules-of-hooks */
import { FilterIcon } from "lucide-react";
import type { FilterBarProps } from "../types";

const FilterBar = ({ setSearch, 
    tagSearch, 
    setTagSearch, 
    sortType, 
    setSortType, 
    limit, 
    setLimit, 
    setTweets, 
    fetchTweets }: FilterBarProps) => {

    const popularTags: string[] = [
        "HTML", "CSS", "JavaScript", "React", "NodeJS", "ExpressJS", "MongoDB",
        "TypeScript", "NextJS", "Frontend", "Backend", "FullStack", "API",
        "WebDevelopment", "Programming", "Redux", "TailwindCSS", "GitHub",
        "MERNStack", "CodeNewbie"
    ];

    const handleTagSearch = async (tag: string) => {
        if (tag === tagSearch) {
            setTagSearch("");
            setSearch("");
            setTweets([]);
            await fetchTweets("", sortType, limit, 1);
            return;
        }

        setTagSearch(tag);
        setSearch("");
        setTweets([]);
        await fetchTweets(tag.toLowerCase(), sortType, limit, 1);
    };

    return (
        <div className="w-full flex items-center justify-between p-3 bg-white shadow rounded-xl mb-4 relative overflow-hidden">
            <div className="flex items-center gap-3 hide-scrollbar mr-5">
                {popularTags.map((tag, index) => (
                    <button
                        onClick={() => handleTagSearch(tag)}
                        key={index}
                        className={`px-3 py-1 rounded-md text-xs cursor-pointer ${tag === tagSearch ? "bg-neutral-700 text-neutral-100" : "bg-neutral-200 text-neutral-700"
                            }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>
            <button className="w-12 h-9 rounded-md flex items-center justify-center bg-neutral-200">
                <FilterIcon className="text-neutral-700" />
            </button>
            <div className={`flex flex-col hidden`}>
                {/* Sort */}
                <div className="flex flex-col">
                    <label className="text-sm text-neutral-600 font-medium mb-1">Sort By</label>
                    <select
                        className="px-3 py-2 border border-neutral-300 rounded-md"
                        value={sortType}
                        onChange={(e) => setSortType(e.target.value)}
                    >
                        <option value="desc">Latest (DESC)</option>
                        <option value="asc">Oldest (ASC)</option>
                    </select>
                </div>

                {/* Limit */}
                <div className="flex flex-col">
                    <label className="text-sm text-neutral-600 font-medium mb-1">Page Limit</label>
                    <select
                        className="px-3 py-2 border border-neutral-300 rounded-md"
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                    >
                        <option value={10}>10 per page</option>
                        <option value={20}>20 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
