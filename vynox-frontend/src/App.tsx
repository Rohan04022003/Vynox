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
import VideoPlayPage from "./pages/VideoPlayPage";
import WatchHistory from "./pages/WatchHistory";
import LikedVideos from "./pages/LikedVideos";
import CommentedVideos from "./pages/CommentedVideos";
import SavedTweets from "./pages/SavedTweets";
import LikedTweets from "./pages/LikedTweets";

const App = () => {

  const [isOpenSideNav, setIsOpenSideNav] = useState<boolean>(false)
  const [search, setSearch] = useState<string>("")
  const [tagSearch, setTagSearch] = useState<string>("")

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
              <Navbar setIsOpenNav={setIsOpenSideNav}
                isOpen={isOpenSideNav}
                setSearch={setSearch}
                search={search}
                setTagSearch={setTagSearch} />
              <div className="flex">
                <Sidebar isOpen={isOpenSideNav} />
                <Home
                  setSearch={setSearch}
                  search={search}
                  tagSearch={tagSearch}
                  setTagSearch={setTagSearch}
                />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tweets"
          element={
            <ProtectedRoute>
              <Navbar setIsOpenNav={setIsOpenSideNav}
                isOpen={isOpenSideNav}
                search={search}
                setSearch={setSearch}
                setTagSearch={setTagSearch}
              />
              <div className="flex">
                <Sidebar isOpen={isOpenSideNav} />
                <Tweets
                  setSearch={setSearch}
                  search={search}
                  tagSearch={tagSearch}
                  setTagSearch={setTagSearch}
                />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-tweets"
          element={
            <ProtectedRoute>
              <Navbar setIsOpenNav={setIsOpenSideNav}
                isOpen={isOpenSideNav}
                search={search}
                setSearch={setSearch}
                setTagSearch={setTagSearch}
              />
              <div className="flex">
                <Sidebar isOpen={isOpenSideNav} />
                <SavedTweets />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/liked-Tweets"
          element={
            <ProtectedRoute>
              <Navbar setIsOpenNav={setIsOpenSideNav}
                isOpen={isOpenSideNav}
                search={search}
                setSearch={setSearch}
                setTagSearch={setTagSearch}
              />
              <div className="flex">
                <Sidebar isOpen={isOpenSideNav} />
                <LikedTweets />
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
        <Route
          path="/video/:id"
          element={
            <ProtectedRoute>
              <Navbar setIsOpenNav={setIsOpenSideNav} isOpen={isOpenSideNav} search={search}
                setSearch={setSearch} />
              <div className="flex">
                <Sidebar isOpen={isOpenSideNav} />
                <VideoPlayPage />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="video/watched/history"
          element={
            <ProtectedRoute>
              <Navbar setIsOpenNav={setIsOpenSideNav} isOpen={isOpenSideNav} search={search}
                setSearch={setSearch} />
              <div className="flex">
                <Sidebar isOpen={isOpenSideNav} />
                <WatchHistory />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/videos/liked-by-you"
          element={
            <ProtectedRoute>
              <Navbar setIsOpenNav={setIsOpenSideNav} isOpen={isOpenSideNav} search={search}
                setSearch={setSearch} />
              <div className="flex">
                <Sidebar isOpen={isOpenSideNav} />
                <LikedVideos />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="videos/commented-by-you"
          element={
            <ProtectedRoute>
              <Navbar setIsOpenNav={setIsOpenSideNav} isOpen={isOpenSideNav} search={search}
                setSearch={setSearch} />
              <div className="flex">
                <Sidebar isOpen={isOpenSideNav} />
                <CommentedVideos />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
