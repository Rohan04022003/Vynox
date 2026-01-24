/* eslint-disable react-hooks/exhaustive-deps */
import { FilterIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FilterBarProps } from "../types";

const popularTags: string[] = [
    "HTML", "CSS", "JavaScript", "React", "NodeJS", "ExpressJS", "MongoDB",
    "TypeScript", "NextJS", "Frontend", "Backend", "FullStack", "API",
    "WebDevelopment", "Programming", "Redux", "TailwindCSS", "GitHub",
    "MERNStack", "CodeNewbie"
];

const FilterBar = ({
    sortType,
    setSortType,
    limit,
    setLimit,
    onFilterChange,
    showTags = true, // iska use tag ko show aur hide ke liye
    title
}: FilterBarProps) => {
    const isFirstRender = useRef(true);
    const [isOpen, setIsOpen] = useState(false);
    const [activeTag, setActiveTag] = useState<string>("");

    useEffect(() => {
        if (isFirstRender.current) { // hum already home, tweet pages se videos or tweet fetch kr rhe hai toh 2 time run hone se rok rhe hai.
            isFirstRender.current = false;
            return;
        }

        onFilterChange({ // yaha pe jb sortType and limit change hoga tb run hoga.
            sortType,
            limit,
            tag: activeTag
        });

        setIsOpen(false);
    }, [sortType, limit]);

    const handleTagClick = (tag: string) => {
        const newTag = tag === activeTag ? "" : tag;

        setActiveTag(newTag);

        onFilterChange({ // yaha pe tag, sortType, limit ka value set kr rhe hai. jb handleTagClick run hoga.
            tag: newTag,
            sortType,
            limit
        });
    };

    return (
        <div className={`w-full flex items-center justify-between ${!showTags ? "mb-5" : "p-3 bg-white shadow rounded-xl mb-4 relative"}`}>
            {/* Left Section */}
            {showTags ? (
                <div className="flex items-center gap-3 hide-scrollbar mr-5">
                    {popularTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            className={`px-3 py-1 rounded-md text-xs cursor-pointer ${tag === activeTag
                                ? "bg-sky-700 text-neutral-100"
                                : "bg-neutral-200 text-neutral-700"
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            ) : (
                title && (
                    <div className="heading">
                        <h2 className="font-semibold text-neutral-700">
                            {title.heading}
                        </h2>
                        {title.subHeading && (
                            <p className="text-xs text-neutral-500 font-medium">
                                {title.subHeading}
                            </p>
                        )}
                    </div>
                )
            )}

            {/* Filter Button */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="w-10 h-7 rounded-md flex items-center justify-center bg-neutral-200 cursor-pointer"
            >
                <FilterIcon size={16} className="text-neutral-700" />
            </button>

            {/* Dropdown */}
            <div
                className={`w-60 z-10 flex-col fixed bg-neutral-200 shadow-sm shadow-black-200 p-3 right-5 top-36 rounded-md ${isOpen ? "flex" : "hidden"
                    }`}
            >
                {/* Sort */}
                <div className="flex flex-col pb-3">
                    <label className="text-xs text-neutral-600 font-medium mb-1">
                        Sort By
                    </label>
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
                    <label className="text-xs text-neutral-600 font-medium mb-1">
                        Page Limit
                    </label>
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
