import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Tweets from "./pages/Tweets";
import VideoUploadForm from "./pages/VideoUploadForm";

const App = () => {
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
        <Route
          path="/welcome"
          element={
            <PublicRoute>
              <Welcome />
            </PublicRoute>
          }
        />

        {/* ---- protected routes ---- */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navbar />
              <div className="flex">
                <Sidebar />
                <Home />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tweets"
          element={
            <ProtectedRoute>
              <Navbar />
              <div className="flex">
                <Sidebar />
                <Tweets />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-video"
          element={
            <ProtectedRoute>
              <Navbar />
              <div className="flex">
                <Sidebar />
                <VideoUploadForm />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
