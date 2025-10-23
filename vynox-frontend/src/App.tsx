import { Route, Routes } from "react-router-dom"
import Login from "./pages/auth/Login.tsx"
import Welcome from "./pages/Welcome.tsx"
import Register from "./pages/auth/Register.tsx"
import Home from "./pages/Home.tsx"
import { Toaster } from "react-hot-toast"
import ProtectedRoute from "./components/ProtectedRoute.tsx"
import PublicRoute from "./components/PublicRoute.tsx"

const App = () => {
  return (
    <div>
      {/* Global toaster */}
      <Toaster
        position="bottom-center" // notification position
        reverseOrder={false} // latest on top or bottom
      />
      <Routes>
        {/* auth routes */}
        <Route path="/user/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/user/register" element={<PublicRoute><Register /></PublicRoute>} />
        {/* pages */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App