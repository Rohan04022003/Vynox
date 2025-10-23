/* eslint-disable @typescript-eslint/no-explicit-any */
import { Home, Clock, ThumbsUp, Settings, LogOut, Image, MessageSquareIcon } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";

const Sidebar = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();

    // logout handler
    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser({});
        navigate("/user/login");
    };

    // reusable sidebar item component
    const MenuItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2 cursor-pointer text-sm font-medium 
        ${isActive ? "bg-neutral-200 text-neutral-700" : "text-neutral-600 hover:bg-neutral-100"}`
            }
        >
            <Icon size={18} />
            <span>{label}</span>
        </NavLink>
    );

    return (
        <div className="w-60 min-h-[91vh] bg-neutral-50 border-r border-neutral-200 flex flex-col justify-between py-4">
            <div className="flex flex-col gap-2">
                <MenuItem to="/" icon={Home} label="Home" />
                <MenuItem to="/tweets" icon={Image} label="Tweets" />
                <MenuItem to="/history" icon={Clock} label="History" />
                <MenuItem to="/liked" icon={ThumbsUp} label="Liked Videos" />
                <MenuItem to="/library" icon={MessageSquareIcon} label="Commented Vidoes" />
            </div>

            <div className="flex flex-col border-t border-neutral-200 pt-3">
                <MenuItem to="/settings" icon={Settings} label="Settings" />
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-5 py-2 rounded-lg cursor-pointer text-sm font-medium text-neutral-600 hover:bg-neutral-100"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
