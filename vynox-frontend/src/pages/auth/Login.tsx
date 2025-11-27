/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom"
import vynox from "../../assets/vynox.png"
import google_logo from "../../assets/google.webp"
import { useState } from "react"
import { Eye, EyeClosed } from "lucide-react"
import axios from "axios"
import { useUser } from "../../context/userContext"

const Login = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  function onChangeFormData(e: any) {
    const { name, value } = e.target;
    setFormData((prev) => (
      {
        ...prev, [name]: value
      }
    ))
  }

  async function handleSubmit(e: any) {
    setLoading(true)
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, formData, { withCredentials: true });

      if (response.status === 200) {
        setUser(response.data?.data?.user)
        setError(response.data?.message || "")
        console.log(user)
        navigate("/")
      } else {
        console.error(response.data?.data?.message)
        setError(response.data?.data?.message)
      }

    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      setError(error.response?.data?.message)
    } finally {
      setLoading(false)
    }

  }

  return (
    <div
      // style={{ backgroundImage: `url(${welcomeBg})`}}
      className="w-screen h-screen flex items-center justify-center px-4">

      <form onSubmit={(e) => handleSubmit(e)} className="relative w-[25rem] min-h-[30rem] p-8 flex flex-col gap-3 border rounded-sm border-neutral-300">

        <div className="absolute -top-7 left-1/2 -translate-x-1/2 p-2 rounded-2xl border border-neutral-500 bg-white">
          <img src={vynox} alt="vynox" className="w-10 z-10" />
        </div>

        <h2 className="text-2xl font-semibold">Login</h2>

        <p className="text-sm italic text-neutral-700 mb-4">Welcome back! Please enter your details.</p>

        <div className="flex flex-col gap-4">
          <div className="w-full flex flex-col">
            <label htmlFor="email">Email</label>
            <input required onChange={onChangeFormData} value={formData.email} type="text" name="email" id="email" className="border-b border-neutral-500 focus:border-blue-500 outline-none" />
          </div>

          <div className="w-full flex flex-col relative">
            <label htmlFor="password">Password</label>
            <input required onChange={onChangeFormData} value={formData.password} type={showPassword ? "text" : "password"} name="password" id="password" className="border-b border-neutral-500 focus:border-blue-500 outline-none" />
            <button type="button" onClick={() => { setShowPassword(prev => (!prev)) }} className="absolute right-1 top-5 cursor-pointer text-neutral-500">
              {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
            </button>
          </div>

          {/* all link tags replace with button later */}

          <Link to={"/user/forgot-password"} className="w-fit hover:text-neutral-600 duration-200">Forgot Password ?</Link>

          <div className="w-full">
            {error && (
              <p className={`px-2 py-2 rounded text-sm ${user?.status === 200 ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                {error}
              </p>
            )}
          </div>

          <button disabled={loading ? true : false} className="w-full flex items-center justify-center px-6 py-2 bg-[#005fb8] text-white rounded-sm font-semibold hover:bg-[#006dd2] duration-300">{loading ? <span className="loader"></span> : "Login"}</button>

          <button className="w-full cursor-not-allowed flex items-center justify-center px-6 py-2 rounded-md font-semibold border border-neutral-500 hover:bg-neutral-100">
            <img src={google_logo} alt="login with google" className="w-6 mr-2" />
            <span>Login with Google</span>
          </button>

          <div className="flex items-center gap-2 mt-5 text-sm">
            <h4 className="text-neutral-600">Don't have an account?</h4>
            <Link to={"/user/register"} className="text-neutral-800 font-semibold" >Sign up for free</Link>
          </div>

        </div>

      </form>

    </div>
  )
}

export default Login