/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom"
import vynox from "../../assets/vynox.png"
import google_logo from "../../assets/google.webp"
import { useState } from "react"
import { Eye, EyeClosed, Loader } from "lucide-react"
import axios from "axios"
import { useUser } from "../../context/userContext"

const Login = () => {

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  function onChangeFormData(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    <div className="w-screen h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="relative w-[25rem] min-h-[30rem] p-8 flex flex-col gap-3 border rounded-sm border-neutral-300"
      >
        {/* Logo */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 p-2 rounded-2xl border border-neutral-500 bg-white">
          <img src={vynox} alt="vynox" className="w-10" />
        </div>

        <h2 className="text-2xl font-semibold">Login</h2>
        <p className="text-sm italic text-neutral-700 mb-4">
          Welcome back! Please enter your details.
        </p>

        {/* Identifier */}
        <div className="flex flex-col gap-1">
          <label htmlFor="identifier">Email or Username</label>
          <input
            required
            id="identifier"
            name="identifier"
            type="text"
            value={formData.identifier}
            onChange={onChangeFormData}
            className="border-b border-neutral-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1 relative">
          <label htmlFor="password">Password</label>
          <input
            required
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={onChangeFormData}
            className="border-b border-neutral-500 focus:border-blue-500 outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-1 top-7 text-neutral-500"
          >
            {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
          </button>
        </div>

        {/* Forgot password */}
        <Link
          to="/user/forgot-password"
          className="w-fit text-sm hover:text-neutral-600 duration-200"
        >
          Forgot Password?
        </Link>

        {/* Error */}
        {error && (
          <p className="px-2 py-2 rounded text-sm bg-red-50 text-red-800">
            {error}
          </p>
        )}

        {/* Login button */}
        <button
          disabled={loading}
          className="w-full flex items-center justify-center px-6 py-2 bg-[#005fb8] text-white rounded-sm font-semibold hover:bg-[#006dd2] duration-300"
        >
          {loading ? <Loader size={24} className="animate-spin" /> : "Login"}
        </button>

        {/* Google login (disabled for now) */}
        <button
          type="button"
          disabled
          className="w-full cursor-not-allowed flex items-center justify-center px-6 py-2 rounded-md font-semibold border border-neutral-500 hover:bg-neutral-100"
        >
          <img
            src={google_logo}
            alt="login with google"
            className="w-6 mr-2"
          />
          <span>Login with Google</span>
        </button>

        {/* Register */}
        <div className="flex items-center gap-2 mt-5 text-sm">
          <span className="text-neutral-600">
            Don't have an account?
          </span>
          <Link
            to="/user/register"
            className="text-neutral-800 font-semibold"
          >
            Sign up for free
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login