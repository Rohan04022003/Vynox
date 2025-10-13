/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Register.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import vynox from "../../assets/vynox.png";
import google_logo from "../../assets/google.webp";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
    coverImage: null,
  });

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    alert("Register form submitted!");
    // here you can call your API to register the user
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center relative px-4">

      {/* Registration Card */}
      <form
        onSubmit={handleSubmit}
        className="relative w-[40rem] p-8 flex flex-col gap-4 bg-white border border-neutral-300 rounded-sm"
      >

        <div className="absolute -top-7 left-1/2 -translate-x-1/2 p-2 rounded-2xl border border-neutral-500 bg-white">
          <img src={vynox} alt="vynox" className="w-10" />
        </div>

        <h2 className="text-2xl font-semibold text-left">Register</h2>
        <p className="text-sm italic text-neutral-700 text-left mb-4">
          Create your account to get started!
        </p>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label htmlFor="fullName">Full Name <span className="text-red-600">*</span></label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="border-b border-neutral-500 focus:border-blue-500 outline-none py-1"
              required
            />
          </div>

          <div className="flex lg:flex-row flex-col items-center w-full gap-5">
            <div className="flex flex-col w-full">
              <label htmlFor="username">Username <span className="text-red-600">*</span></label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className="border-b border-neutral-500 focus:border-blue-500 outline-none py-1"
                required
              />
            </div>

            <div className="flex flex-col w-full">
              <label htmlFor="email">Email <span className="text-red-600">*</span></label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="border-b border-neutral-500 focus:border-blue-500 outline-none py-1"
                required
              />
            </div>
          </div>

          <div className="flex lg:flex-row flex-col items-center w-full gap-5">
            <div className="flex flex-col w-full">
              <label htmlFor="password">Password <span className="text-red-600">*</span></label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="border-b border-neutral-500 focus:border-blue-500 outline-none py-1"
                required
              />
            </div>

            <div className="flex flex-col w-full">
              <label htmlFor="avatar">Avatar <span className="text-red-600">*</span></label>
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={handleChange}
                className="border-b border-neutral-500 focus:border-blue-500 outline-none py-1"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="coverImage">Cover Image</label>
            <input
              type="file"
              name="coverImage"
              id="coverImage"
              onChange={handleChange}
              className="border-b border-neutral-500 focus:border-blue-500 outline-none py-1"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-4 px-6 py-2 bg-[#005fb8] text-white rounded-md font-semibold hover:bg-[#006dd2] duration-300 cursor-pointer"
        >
          Register
        </button>

        <button
          type="button"
          className="w-full flex items-center justify-center px-6 py-2 rounded-md font-semibold border border-neutral-500 hover:bg-neutral-100 cursor-pointer mt-2"
        >
          <img src={google_logo} alt="google" className="w-6 mr-2" />
          Register with Google
        </button>

        <div className="flex items-center justify-center gap-2 mt-4 text-sm">
          <span className="text-neutral-600">Already have an account?</span>
          <Link to="/user/login" className="text-neutral-800 font-semibold">
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
