import { Route, Routes } from "react-router-dom"
import Login from "./pages/auth/Login.tsx"
import Welcome from "./pages/Welcome.tsx"
import Register from "./pages/auth/Register.tsx"
import Home from "./pages/home.tsx"
import { Toaster } from "react-hot-toast"

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
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/register" element={<Register />} />
        {/* pages */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App