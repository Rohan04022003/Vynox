/* eslint-disable @typescript-eslint/no-explicit-any */
import { Home, Clock, ThumbsUp, Settings, LogOut, Image, MessageSquareIcon } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import axios from "axios";
import { useState } from "react";

const Sidebar = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();

    const [loading, setLoading] = useState(false);

    // logout handler
    const handleLogout = async () => {

        try {
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/logout`, {}, { withCredentials: true })

            if (response.status === 200) {
                localStorage.removeItem("user");
                setUser(null);
                navigate("/user/login");
                setLoading(false)
            }

        } catch (error: any) {
            setLoading(false)
            console.log(error.response?.data?.message)
        }

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
        <div className="w-60 fixed lg:sticky top-16 z-10 h-[91vh] bg-neutral-100 border-neutral-200 flex flex-col justify-between py-4">
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
                    {
                        loading ?
                            <span className="loader"></span> :
                            <><LogOut size={18} />
                                <span>Logout</span></>
                    }
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
