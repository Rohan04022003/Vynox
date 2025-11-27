import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Tweets from "./pages/Tweets";
import VideoUploadForm from "./pages/VideoUploadForm";
import TweetUploadForm from "./pages/TweetUploadForm";
import { useState } from "react";

const App = () => {

  const [isOpenSideNav, setIsOpenSideNav] = useState<boolean>(false)

  return (
    <>
      {/* Global Toast Notification */}
      <Toaster position="bottom-center" reverseOrder={false} />

      {/* App Routing */}
      <Routes>
        {/* ---- public routes ---- */}
        <Route
          path="/user/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/user/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* ---- protected routes ---- */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navbar setIsOpenNav={setIsOpenSideNav} isOpen={isOpenSideNav} />
              <div className="flex">
                <Sidebar isOpen={isOpenSideNav} />
                <Home />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tweets"
          element={
            <ProtectedRoute>
              <Navbar setIsOpenNav={setIsOpenSideNav} isOpen={isOpenSideNav} />
              <div className="flex">
                <Sidebar isOpen={isOpenSideNav} />
                <Tweets />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-video"
          element={
            <ProtectedRoute>
              <Navbar setIsOpenNav={setIsOpenSideNav} isOpen={isOpenSideNav} />
              <div className="flex">
                <Sidebar isOpen={isOpenSideNav} />
                <VideoUploadForm />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-tweet"
          element={
            <ProtectedRoute>
              <Navbar setIsOpenNav={setIsOpenSideNav} isOpen={isOpenSideNav} />
              <div className="flex">
                <Sidebar isOpen={isOpenSideNav} />
                <TweetUploadForm />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
