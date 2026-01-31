/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Home,
    Clock,
    ThumbsUp,
    LogOut,
    MessageSquareIcon,
    Heart,
    Loader,
    Bookmark,
    Target,
    BookOpen,
    LayoutDashboard,
    User,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import axios from "axios";
import { memo, useState } from "react";
import type { MenuItemProps, SidebarProps } from "../types";


const MenuItem = memo(({ to, icon: Icon, label }: MenuItemProps) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2 cursor-pointer text-xs font-medium
        ${isActive
                    ? "bg-neutral-200 text-sky-700 font-semibold"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`
            }
        >
            {Icon && <Icon size={18} />}
            <span>{label}</span>
        </NavLink>
    );
});


const Sidebar = ({ isOpen }: SidebarProps) => {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const [loading, setLoading] = useState(false);


    const handleLogout = async () => {
        try {
            setLoading(true);
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/users/logout`,
                {},
                { withCredentials: true }
            );

            if (res.status === 200) {
                localStorage.removeItem("user");
                setUser(null);
                navigate("/user/login");
            }
        } catch (error: any) {
            console.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`fixed lg:sticky top-16 z-10 h-[91vh] bg-neutral-100 border-neutral-200 
      flex flex-col justify-between py-4 duration-300 text-nowrap
      ${isOpen ? "left-0" : "-left-60"} lg:left-0`}
        >

            <div className="flex flex-col gap-2">
                <MenuItem to="/" icon={Home} label={isOpen ? "Home" : ""} />
                <MenuItem to="/tweets" icon={BookOpen} label={isOpen ? "Tweets" : ""} />
                <MenuItem
                    to="/liked-tweets"
                    icon={Heart}
                    label={isOpen ? "Liked Tweets" : ""}
                />
                <MenuItem
                    to="/saved-tweets"
                    icon={Bookmark}
                    label={isOpen ? "Saved Tweets" : ""}
                />
                <MenuItem
                    to="/videos/liked-by-you"
                    icon={ThumbsUp}
                    label={isOpen ? "Liked Videos" : ""}
                />
                <MenuItem
                    to="/video/watched/history"
                    icon={Clock}
                    label={isOpen ? "Watched History" : ""}
                />
                <MenuItem
                    to="/video/favourite/lists"
                    icon={Target}
                    label={isOpen ? "Favourite Videos" : ""}
                />
                <MenuItem
                    to="/videos/commented-by-you"
                    icon={MessageSquareIcon}
                    label={isOpen ? "Commented Videos" : ""}
                />
            </div>
            <div className="flex flex-col border-t border-neutral-200 pt-3">
                <MenuItem
                    to="/profile/user"
                    icon={User}
                    label={isOpen ? "Profile" : ""}
                />
                <MenuItem
                    to="/dashboard/user"
                    icon={LayoutDashboard}
                    label={isOpen ? "Dashboard" : ""}
                />

                <button
                    disabled={loading}
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-5 py-2 rounded-md cursor-pointer text-xs font-medium 
          text-neutral-600 hover:bg-neutral-100 disabled:opacity-60"
                >
                    {loading ? (
                        <Loader size={18} className="animate-spin" />
                    ) : (
                        <>
                            <LogOut size={18} />
                            {isOpen && <span>Logout</span>}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
