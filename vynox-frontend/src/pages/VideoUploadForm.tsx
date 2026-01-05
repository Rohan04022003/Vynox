
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { EarthLock, Image as ImageIcon, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

interface FilePreview {
    file: HTMLInputElement;
    previewURL: string;
}

const VideoUploadForm = () => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isPublished, setPublished] = useState<boolean>(true);
    const [thumbnail, setThumbnail] = useState<FilePreview | null>(null);
    const [videoFile, setVideoFile] = useState<FilePreview | null>(null);
    const [videoSize, setVideoSize] = useState<number | undefined>(undefined)
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
        const fileInput = e.target;
        if (fileInput && fileInput.files && fileInput.files[0]) {
            const previewURL = URL.createObjectURL(fileInput.files[0]);
            setThumbnail({ file: fileInput, previewURL });
        }
    };

    const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const fileInput = e.target;
        if (fileInput && fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            const previewURL = URL.createObjectURL(fileInput.files[0]);
            setVideoFile({ file: fileInput, previewURL });
            setVideoSize(file.size);
        }
    };

    const removeThumbnail = () => {
        setThumbnail(null);
    };

    const removeVideo = () => {
        setVideoFile(null);
        setVideoSize(undefined)
    };

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!thumbnail?.file?.files?.[0] || !videoFile?.file?.files?.[0]) {
            toast.error("Please upload both thumbnail and video.");
            return;
        } else if (videoSize && videoSize / (1024 * 1024) > 80) {
            toast.error("video should not more than 80MB.");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("isPublished", isPublished.toString());
            formData.append("thumbnail", thumbnail.file.files[0]);
            formData.append("videoFile", videoFile.file.files[0]);

            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/videos`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Video Uploaded Successfully!");
                navigate("/");
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    error.message ||
                    "Something went wrong.";

                toast.error(message);
                return;
            }
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="w-full flex flex-col items-center pt-5">
            <div className="flex items-center pb-4">
                <button className="px-3 py-2 rounded-l-md bg-neutral-200 text-sm">Upload Video</button>
                <button onClick={() => navigate('/upload-tweet')} className="px-3 py-2 rounded-r-md bg-neutral-50 text-sm cursor-pointer">Upload Tweets</button>
            </div>

            <p className="text-lg font-medium text-neutral-700">Let's break your own records!!!</p>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col md:flex-row justify-center gap-10 w-full max-w-4xl">
                <div className="w-full md:w-1/2">
                    <div className="flex flex-col gap-2 pb-3">
                        <label htmlFor="title" className="text-sm text-neutral-600 font-medium">Video Title</label>
                        <textarea
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            id="title"
                            name="title"
                            className="border h-14 w-full rounded-md border-neutral-400 text-sm resize-none px-2 py-1 text-neutral-700 outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-500"
                            placeholder="Type title here ..."
                        />
                    </div>

                    <div className="flex flex-col gap-2 pb-3">
                        <label htmlFor="description" className="text-sm text-neutral-600 font-medium">Video Description</label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            id="description"
                            name="description"
                            className="border h-28 w-full rounded-md border-neutral-400 text-sm resize-none px-2 py-1 text-neutral-700 outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-500"
                            placeholder="Type description here ..."
                        />
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-neutral-600 font-medium">Video Thumbnail</label>
                        <div className="relative w-full h-40 border border-neutral-300 rounded-lg flex items-center justify-center bg-neutral-100 overflow-hidden cursor-pointer">
                            {!thumbnail ? (
                                <label
                                    htmlFor="thumbnail"
                                    className="flex flex-col items-center gap-2 text-neutral-500 hover:text-neutral-700"
                                >
                                    <ImageIcon size={32} />
                                    <span className="text-xs">Click to Upload</span>
                                </label>
                            ) : (
                                <>
                                    <img
                                        src={thumbnail.previewURL}
                                        alt="thumbnail preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeThumbnail}
                                        className="absolute top-2 right-2 bg-neutral-800 text-white rounded-full p-1 hover:bg-neutral-600"
                                    >
                                        <X size={16} />
                                    </button>
                                </>
                            )}
                            <input
                                type="file"
                                id="thumbnail"
                                name="thumbnail"
                                className="hidden"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full md:w-1/2">
                    {/* Video Upload */}
                    <div className="flex flex-col gap-2 mt-3">
                        <label className="text-sm text-neutral-600 font-medium">Actual Video</label>
                        <div className="relative w-full h-70 border border-neutral-300 rounded-lg flex items-center justify-center bg-neutral-100 overflow-hidden cursor-pointer">
                            {!videoFile ? (
                                <label
                                    htmlFor="video"
                                    className="flex flex-col items-center gap-2 text-neutral-500 hover:text-neutral-700"
                                >
                                    🎥 Upload Video
                                </label>
                            ) : (
                                <>
                                    <video
                                        muted
                                        src={videoFile?.previewURL}
                                        controls
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeVideo}
                                        className="absolute top-2 right-2 bg-neutral-800 text-white rounded-full p-1 hover:bg-neutral-600"
                                    >
                                        <X size={16} />
                                    </button>
                                </>
                            )}
                            <input
                                type="file"
                                id="video"
                                name="videoFile"
                                className="hidden"
                                accept="video/*"
                                onChange={handleVideoChange}
                            />
                        </div>
                        <p className="text-xs font-medium text-red-600">{videoSize && videoSize / (1024 * 1024) > 80 ? "Video size must be less than 80MB" : ""}</p>
                    </div>

                    <div className="flex items-center gap-2 py-3">
                        <label htmlFor="isPublished" className="flex items-center gap-[5px] cursor-pointer">
                            <EarthLock size={18} color="gray" />
                            <span className="text-sm text-neutral-600">Click here to private video.</span>
                        </label>
                        <input defaultChecked={false} onChange={(e) => setPublished(e.target.checked)} type="checkbox" name="isPublished" id="isPublished" className="mt-1 accent-neutral-600 cursor-pointer" />
                    </div>

                    <button className="px-4 py-2 rounded-md bg-neutral-800 text-white hover:bg-neutral-700 transition cursor-pointer">
                        {loading ? <span className="loader"></span> : "Publish Video"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VideoUploadForm;