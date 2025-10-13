import { Route, Routes } from "react-router-dom"
import Login from "./pages/auth/Login.tsx"
import Welcome from "./pages/Welcome.tsx"
import Register from "./pages/auth/Register.tsx"

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/register" element={<Register />} />
      </Routes>
    </div>
  )
}

export default App