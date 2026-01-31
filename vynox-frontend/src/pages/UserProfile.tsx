import MyVideoCard from "../components/MyVideoCard";
import { useUser } from "../context/userContext";

export default function UserProfile() {

    const { user } = useUser();

    return (
        <div className="min-h-screen w-full lg:px-30 pt-5 bg-[#f9f9f9] text-black">
            {/* Cover */}
            <div className="relative h-48 sm:h-64 w-full">
                <img
                    src={user?.coverImage?.url}
                    alt="cover"
                    className="h-full w-full object-cover rounded-2xl"
                />

                {/* Avatar */}
                <div className="absolute -bottom-14 left-4 sm:left-8">
                    <img
                        src={user?.avatar?.url}
                        alt="avatar"
                        className="h-28 w-28 sm:h-36 sm:w-36 rounded-full border-4 border-white object-cover"
                    />
                </div>
            </div>

            {/* Profile Info */}
            <div className="px-4 sm:px-8 pt-15 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">{user.fullName}</h1>
                        <p className="text-sm text-gray-600">@{user.username}</p>
                        <p className="mt-2 text-gray-700 max-w-xl">{user.bio}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-full bg-neutral-200 text-neutral-700 font-medium text-sm hover:opacity-90 cursor-pointer">
                            Edit Profile
                        </button>
                        <button className="px-4 py-2 rounded-full border border-neutral-200 text-neutral-700 font-medium text-sm hover:bg-gray-100 cursor-pointer">
                            Change Password
                        </button>
                    </div>
                </div>

                {/* Stats (YouTube style) */}
                {/* <div className="mt-6 flex gap-6 text-sm">
                    <div>
                        <span className="font-medium">{user.stats.videos}</span> Videos
                    </div>
                    <div>
                        <span className="font-medium">{user.stats.subscribers}</span> Subscribers
                    </div>
                    <div>
                        <span className="font-medium">{user.stats.likes}</span> Likes
                    </div>
                </div> */}

                {/* Meta */}
                <div className="mt-4 text-sm text-gray-600">
                    <p>Email: {user.email}</p>
                    <p>Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Social Links */}
                <div className="mt-6 flex flex-wrap gap-3">
                    {user?.socialLinks?.github && (
                        <a
                            href={user.socialLinks.github}
                            target="_blank"
                            className="px-4 py-2 rounded-full bg-gray-100 text-sm hover:bg-gray-200"
                        >
                            GitHub
                        </a>
                    )}
                    {user?.socialLinks?.instagram && (
                        <a
                            href={user.socialLinks.instagram}
                            target="_blank"
                            className="px-4 py-2 rounded-full bg-gray-100 text-sm hover:bg-gray-200"
                        >
                            Instagram
                        </a>
                    )}
                    {user?.socialLinks?.linkedin && (
                        <a
                            href={user.socialLinks.linkedin}
                            target="_blank"
                            className="px-4 py-2 rounded-full bg-gray-100 text-sm hover:bg-gray-200"
                        >
                            Linkedin
                        </a>
                    )}
                    {user?.socialLinks?.twitter && (
                        <a
                            href={user.socialLinks.twitter}
                            target="_blank"
                            className="px-4 py-2 rounded-full bg-gray-100 text-sm hover:bg-gray-200"
                        >
                            Twitter
                        </a>
                    )}
                </div>

                {/* Tabs */}
                <div className="mt-10 border-b flex gap-6 text-sm">
                    <button className="pb-3 border-b-2 border-black font-medium">Videos</button>
                    <button className="pb-3 text-gray-500">Tweets</button>
                </div>

                {/* Video Grid Placeholder */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <MyVideoCard key={i}/>
                    ))}
                </div>
            </div>
        </div>
    );
}
