import { useEffect } from "react";
import { useParams } from "react-router-dom";
import MyVideoCard from "../components/MyVideoCard";
import { useUser } from "../context/userContext";
import { ProfileSkeleton } from "../components/skeleton/ProfileSkeleton";
import { Link } from "lucide-react";

/* ---------------- Stat Pill ---------------- */
const StatPill = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number | string | undefined;
  highlight?: boolean;
}) => {
  return (
    <div
      className={`font-semibold rounded-full px-3 py-1 whitespace-nowrap
        ${
          highlight
            ? "bg-green-100 text-green-700"
            : "bg-neutral-200 text-gray-700"
        }`}
    >
      <span>{value ?? 0}</span> {label}
    </div>
  );
};

/* ---------------- User Profile Page ---------------- */
export default function UserProfile() {
  const { getChannelStats, loadingStats, channelStats } = useUser();
  const { channelId } = useParams<{ channelId: string }>();

  /* -------- Fetch channel stats -------- */
  useEffect(() => {
    if (channelId) {
      getChannelStats(channelId);
    }
  }, [channelId]);

  const user = channelStats?.user;
  const stats = channelStats?.stats;

  /* -------- Loading State -------- */
  if (loadingStats) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-gray-500">
        <ProfileSkeleton />
      </div>
    );
  }

  /* -------- Error / Empty State -------- */
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Failed to load profile
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full lg:px-30 pt-5 bg-[#f9f9f9] text-neutral-800">
      {/* ---------------- Cover ---------------- */}
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

      {/* ---------------- Profile Info ---------------- */}
      <div className="px-4 sm:px-8 pt-16 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{user.fullName}</h1>
            <p className="text-sm text-gray-600">@{user.username}</p>
            {user.bio && (
              <p className="mt-2 text-gray-700 max-w-xl">{user.bio}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-full bg-neutral-200 text-neutral-700 font-medium text-sm hover:opacity-90">
              Edit Profile
            </button>
            <button className="px-4 py-2 rounded-full border border-neutral-200 text-neutral-700 font-medium text-sm hover:bg-gray-100">
              Change Password
            </button>
          </div>
        </div>

        {/* ---------------- Channel Stats ---------------- */}
        <div className="mt-6 flex flex-wrap gap-3 text-xs text-gray-700">
          <StatPill label="Videos" value={stats?.totalVideos} />
          <StatPill label="Video Views" value={stats?.totalVideoViews} />
          <StatPill label="Video Likes" value={stats?.totalVideoLikes} />
          <StatPill label="Tweets" value={stats?.totalTweets} />
          <StatPill label="Tweet Likes" value={stats?.totalTweetLikes} />
          <StatPill label="Subscribers" value={stats?.totalSubscribers} />
        </div>

        {/* ---------------- Meta ---------------- */}
        <div className="mt-4 text-sm text-gray-600">
          <p>Email: {user.email}</p>
          <p>
            Joined{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "—"}
          </p>
        </div>

        {/* ---------------- Social Links ---------------- */}
                <h2 className="flex items-center gap-1 mt-3 font-medium text-neutral-800"><Link size={18}/> Social Media Links</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {user?.socialLinks?.github && (
            <a
              href={user.socialLinks.github}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 rounded-full bg-neutral-200 text-sm hover:bg-neutral-300"
            >
              GitHub
            </a>
          )}
          {user?.socialLinks?.instagram && (
            <a
              href={user.socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full bg-gray-100 text-sm hover:bg-gray-200"
            >
              Instagram
            </a>
          )}
          {user?.socialLinks?.linkedin && (
            <a
              href={user.socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full bg-gray-100 text-sm hover:bg-gray-200"
            >
              Linkedin
            </a>
          )}
          {user?.socialLinks?.twitter && (
            <a
              href={user.socialLinks.twitter}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full bg-gray-100 text-sm hover:bg-gray-200"
            >
              Twitter
            </a>
          )}
        </div>

        {/* ---------------- Tabs ---------------- */}
        <div className="mt-10 border-b-3 border-neutral-300 flex gap-3 text-sm">
          <button className="mb-2 px-3 py-1 rounded-md font-medium bg-neutral-800 text-white">
            Videos
          </button>
          <button className="mb-2 px-3 py-1 rounded-md font-medium bg-neutral-200 text-neutral-800">Tweets</button>
        </div>

        {/* ---------------- Video Grid ---------------- */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <MyVideoCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
