/* eslint-disable react-hooks/exhaustive-deps */
import { FilterIcon } from "lucide-react";
import type { FilterBarProps } from "../types";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const FilterBar = ({ search,
    setSearch,
    tagSearch,
    setTagSearch,
    sortType,
    setSortType,
    limit,
    setLimit,
    setTweets,
    fetchTweets,
    setVideos,
    fetchVideos
}: FilterBarProps) => {

    const popularTags: string[] = [
        "HTML", "CSS", "JavaScript", "React", "NodeJS", "ExpressJS", "MongoDB",
        "TypeScript", "NextJS", "Frontend", "Backend", "FullStack", "API",
        "WebDevelopment", "Programming", "Redux", "TailwindCSS", "GitHub",
        "MERNStack", "CodeNewbie"
    ]; // yeh kuch frequent search tabs or tags hai.

    const isFirstRender = useRef(true); // first render ko prevent krne ke liye
    const [isOpen, setIsOpen] = useState<boolean>(false) // filter div ko show hide ke liye.
    const location = useLocation(); // iska use path match ke liye kiya hai.

    useEffect(() => { // yeh tab chalega jb filter me koi changes aayega aur ha path ke according function call hoga.

        if (isFirstRender.current) {
            // skip initial render
            isFirstRender.current = false;
            return;
        }

        if (location.pathname === "/tweets") {
            fetchTweets?.(search || tagSearch || "", sortType, limit, 1)
            setIsOpen(false)
        } else {
            fetchVideos?.(search || tagSearch || "", sortType, limit, 1)
            setIsOpen(false)
        }

    }, [sortType, limit])

    const handleTagSearch = async (tag: string) => { //tags or tab search ke liye aur woh bhi location ke base pe.
        if (location.pathname === "/tweets") {

            if (tag === tagSearch) {
                setTagSearch("");
                setSearch("");
                setTweets?.([]);
                await fetchTweets?.("", sortType, limit, 1);
                return;
            }

            setTagSearch(tag);
            setSearch("");
            setTweets?.([]);
            await fetchTweets?.(tag.toLowerCase(), sortType, limit, 1);
        } else {
            if (tag === tagSearch) {
                setTagSearch("");
                setSearch("");
                setVideos?.([]);
                await fetchVideos?.("", sortType, limit, 1);
                return;
            }

            setTagSearch(tag);
            setSearch("");
            setVideos?.([]);
            await fetchVideos?.(tag.toLowerCase(), sortType, limit, 1);

        }
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
            <button onClick={() => setIsOpen(prev => !prev)} className="w-12 h-9 rounded-md flex items-center justify-center bg-neutral-200 cursor-pointer">
                <FilterIcon className="text-neutral-700" />
            </button>
            <div className={`w-60 flex-col fixed bg-neutral-200 p-3 right-5 top-36 rounded-md ${isOpen ? "flex" : "hidden"}`}>
                {/* Sort */}
                <div className="flex flex-col pb-3">
                    <label className="text-xs text-neutral-600 font-medium mb-1">Sort By</label>
                    <select
                        className="px-3 py-1 border rounded-md text-xs outline-none border-neutral-300 cursor-pointer text-neutral-700"
                        value={sortType}
                        onChange={(e) => setSortType(e.target.value)}
                    >
                        <option value="desc">Latest First</option>
                        <option value="asc">Oldest First</option>
                    </select>
                </div>

                {/* Limit */}
                <div className="flex flex-col">
                    <label className="text-xs text-neutral-600 font-medium mb-1">Page Limit</label>
                    <select
                        className="px-3 py-1 border border-neutral-300 rounded-md outline-none text-xs cursor-pointer text-neutral-700"
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
