import { Menu, Mic, Plus, Search } from "lucide-react"
import vynox from "../assets/vynox.png"
import { useLocation, useNavigate } from "react-router-dom"
import { useUser } from "../context/userContext"
import type { isOpenSideNavProps } from "../types"
import { useTweets } from "../hooks/useTweets"

const Navbar = ({ setIsOpenNav, isOpen, search, setSearch, setTagSearch }: isOpenSideNavProps) => {

    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUser();
        const { setTweets, fetchTweets, } = useTweets();
    

    const handleSearch = () => {
        if (location.pathname === "/tweets" && search && search.length > 1) {
            console.log("clicked")
            setTagSearch?.("")
            setTweets?.([]);
            fetchTweets?.(search, "desc", 20, 1);
        }
    }

    return (
        <div className="flex items-center justify-between px-6 h-16 w-full bg-[#ffffff5b] text-neutral-600 sticky top-0 z-10 backdrop-blur-2xl">
            <div className="flex items-center justify-center gap-3">
                <Menu onClick={() => setIsOpenNav(!isOpen)} className="cursor-pointer" />
                <div className="flex items-center">
                    <img src={vynox} alt="vynox-logo" className="w-9" />
                    <h2 className="text-xl font-semibold">Vynox</h2>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center bg-[#ffffff15] backdrop-blur-3xl w-96 h-9 rounded-full overflow-hidden border border-neutral-200">
                    <input onChange={(e) => setSearch?.(e.target.value)} value={search} type="text" name="search" id="search" placeholder="Search" className="w-full h-full outline-none border-none px-5 text-neutral-600" />
                    <button onClick={handleSearch} className="w-14 h-full flex items-center justify-center border-l-2 border-neutral-200 cursor-pointer">
                        <Search size={18} color="gray" />
                    </button>
                </div>
                <button className="p-2 bg-[#c1c1c14f] rounded-full cursor-pointer"><Mic size={18} color="gray" /></button>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={() => navigate("/upload-video")} className="flex items-center gap-[2px] px-3 py-1 bg-neutral-200 rounded-full cursor-pointer">
                    <Plus size={16} />
                    <span className="text-sm mb-[2px]">Create</span>
                </button>
                <div className="avatar w-8 h-8 rounded-full bg-neutral-200 overflow-hidden">
                    <img src={user?.avatar?.url} alt="avatar" className="w-full h-full bg-cover bg-center" />
                </div>
            </div>
        </div>
    )
}

export default Navbar