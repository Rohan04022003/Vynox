/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Create Context
const UserContext = createContext<any>(null);

// Provider Component
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>({});
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.email) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }, [user]);

    useEffect(() => {
        const getUserFromLocal = localStorage.getItem("user");
        if (getUserFromLocal) {
            setUser(JSON.parse(getUserFromLocal));
        }
    }, []);


    // getting user info

    useEffect(() => {

        const fetchUser = async () => {

            try {
                const response: any = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/users/current-user`,
                    { withCredentials: true }
                );

                if (response.status === 200) {
                    setUser(response.data?.data);
                    localStorage.setItem("user", JSON.stringify(response.data?.data));
                    return;
                }

            } catch (error: any) {
                // 401 ko handle kiya hai
                if (error.response && error.response.status === 401) {
                    try {
                        const refreshRes: any = await axios.post(
                            `${import.meta.env.VITE_BASE_URL}/users/refresh-token`,
                            {},
                            { withCredentials: true }
                        );

                        if (refreshRes.status === 200) {
                            return fetchUser(); // retry
                        }
                    } catch (refreshError) {
                        // refresh token fail hoga tab
                        console.error("Refresh failed:", refreshError);
                        setUser(null);
                        localStorage.removeItem("user");
                        navigate("/user/login")
                    }
                } else {
                    console.error("Error fetching user:", error);
                }
            }
        };

        fetchUser();


    }, []);



    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook (for easy access)
export const useUser = () => useContext(UserContext);
