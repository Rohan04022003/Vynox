/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom"
import vynox from "../../assets/vynox.png"
import google_logo from "../../assets/google.webp"

const login = () => {

  async function handleSubmit(e: any) {
    e.preventDefault();
    console.log("user logged in.")
  }

  return (
    <div
      // style={{ backgroundImage: `url(${welcomeBg})`}}
      className="w-screen h-screen flex items-center justify-center px-4">

      <form onSubmit={(e) => handleSubmit(e)} className="relative w-[25rem] h-[33rem] p-8 flex flex-col gap-3 border rounded-sm border-neutral-300">

        <div className="absolute -top-7 left-1/2 -translate-x-1/2 p-2 rounded-2xl border border-neutral-500 bg-white">
          <img src={vynox} alt="vynox" className="w-10 z-10" />
        </div>

        <h2 className="text-2xl font-semibold">Login</h2>

        <p className="text-sm italic text-neutral-700 mb-4">Welcome back! Please enter your details.</p>

        <div className="flex flex-col gap-6">
          <div className="w-full flex flex-col">
            <label htmlFor="email">Email</label>
            <input type="text" name="email" id="email" className="border-b border-neutral-500 focus:border-blue-500 outline-none" />
          </div>

          <div className="w-full flex flex-col">
            <label htmlFor="password">Password</label>
            <input type="text" name="password" id="password" className="border-b border-neutral-500 focus:border-blue-500 outline-none" />
          </div>

          {/* all link tags replace with button later */}

          <Link to={"/user/forgot-password"} className="w-fit hover:text-neutral-600 duration-200">Forgot Password ?</Link>

          <Link to={"/"} className="w-full flex items-center justify-center px-6 py-2 bg-[#005fb8] text-white rounded-sm font-semibold hover:bg-[#006dd2] duration-300">Login</Link>

          <Link to={"/"} className="w-full flex items-center justify-center px-6 py-2 rounded-md font-semibold border border-neutral-500 hover:bg-neutral-100">
            <img src={google_logo} alt="login with google" className="w-6 mr-2" />
            <span>Login with Google</span>
          </Link>

          <div className="flex items-center gap-2 mt-5 text-sm">
            <h4 className="text-neutral-600">Don't have an account?</h4>
            <Link to={"/user/register"} className="text-neutral-800 font-semibold" >Sign up for free</Link>
          </div>

        </div>

      </form>

    </div>
  )
}

export default login