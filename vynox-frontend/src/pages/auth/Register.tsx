/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import vynox from "../../assets/vynox.png";
import google_logo from "../../assets/google.webp";
import axios from "axios";
import { Loader, X } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    avatar: null as File | null,
    coverImage: null as File | null,
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // it is for page navigation
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e: any) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      if (name === "avatar") {
        setAvatarPreview(URL.createObjectURL(file));
      } else if (name === "coverImage") {
        setCoverPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Remove selected image
  const removeImage = (field: "avatar" | "coverImage") => {
    setFormData((prev) => ({
      ...prev,
      [field]: null,
    }));
    if (field === "avatar") setAvatarPreview(null);
    if (field === "coverImage") setCoverPreview(null);

    // Reset input file (optional but cleaner)
    const input = document.getElementById(field) as HTMLInputElement;
    if (input) input.value = "";
  };

  // Handle form submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      if (formData.avatar) data.append("avatar", formData.avatar);
      if (formData.coverImage) data.append("coverImage", formData.coverImage);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        data,
        {
          withCredentials: true,
        }
      );

      console.log("User Registered:", response.data?.data);
      navigate("/")
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center relative px-4">
      {/* Registration Card */}
      <form
        onSubmit={handleSubmit}
        className="relative w-[40rem] p-8 flex flex-col gap-4 bg-white border border-neutral-300 rounded-sm"
      >
        {/* Logo */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 p-2 rounded-2xl border border-neutral-500 bg-white">
          <img src={vynox} alt="vynox" className="w-10" />
        </div>

        <h2 className="text-2xl font-semibold text-left">Register</h2>
        <p className="text-sm italic text-neutral-700 text-left mb-4">
          Create your account to get started!
        </p>

        {/* Full Name */}
        <div className="flex flex-col">
          <label htmlFor="fullName">
            Full Name <span className="text-red-600">*</span>
          </label>
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

        {/* Username & Email */}
        <div className="flex lg:flex-row flex-col items-center w-full gap-5">
          <div className="flex flex-col w-full">
            <label htmlFor="username">
              Username <span className="text-red-600">*</span>
            </label>
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
            <label htmlFor="email">
              Email <span className="text-red-600">*</span>
            </label>
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

        {/* Password & Avatar */}
        <div className="flex lg:flex-row flex-col items-center w-full gap-5">
          <div className="flex flex-col w-full">
            <label htmlFor="password">
              Password <span className="text-red-600">*</span>
            </label>
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

          <div className="flex flex-col w-full relative">
            <label htmlFor="avatar">
              Avatar <span className="text-red-600">*</span>
            </label>
            <input
              type="file"
              name="avatar"
              id="avatar"
              onChange={handleChange}
              className="border-b border-neutral-500 focus:border-blue-500 outline-none py-1"
              accept="image/*"
              required
            />
            {avatarPreview && (
              <div className="flex items-center gap-2 absolute right-0 top-4">
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="w-8 h-8 object-cover rounded-full border"
                />
                <X
                  onClick={() => removeImage("avatar")}
                  size={18}
                  className="text-red-500 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Cover Image */}
        <div className="flex flex-col w-full relative">
          <label htmlFor="coverImage">Cover Image</label>
          <input
            type="file"
            name="coverImage"
            id="coverImage"
            onChange={handleChange}
            className="border-b border-neutral-500 focus:border-blue-500 outline-none py-1"
            accept="image/*"
          />
          {coverPreview && (
            <div className="flex items-center gap-2 absolute right-0 top-2">
              <img
                src={coverPreview}
                alt="Cover Preview"
                className="w-16 h-10 object-cover border rounded"
              />
              <X
                onClick={() => removeImage("coverImage")}
                size={18}
                className="text-red-500 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-4 px-6 py-2 bg-[#005fb8] text-white rounded-md font-semibold hover:bg-[#006dd2] duration-300 cursor-pointer"
        >
          {loading ? <Loader size={18} className="animate-spin" /> : "Register"}
        </button>

        {/* Google Button */}
        <button
          type="button"
          className="w-full flex items-center justify-center px-6 py-2 rounded-md font-semibold border border-neutral-500 hover:bg-neutral-100 cursor-not-allowed mt-2"
        >
          <img src={google_logo} alt="google" className="w-6 mr-2" />
          Register with Google
        </button>

        {/* Login Link */}
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
