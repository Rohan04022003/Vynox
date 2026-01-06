import axios from "axios";
import { ImageIcon, Loader, X } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"

interface FilePreview {
    file: HTMLInputElement;
    previewURL: string;
}

const TweetUploadForm = () => {

    const navigate = useNavigate();

    const [content, setcontent] = useState<string>("");
    const [tweetImage, setTweetImage] = useState<FilePreview | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handletweetImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const fileInput = e.target;
        if (fileInput && fileInput.files && fileInput.files[0]) {
            const previewURL = URL.createObjectURL(fileInput.files[0]);
            setTweetImage({ file: fileInput, previewURL });
        }
    };

    const removetweetImage = () => {
        setTweetImage(null);
    };

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!tweetImage?.file?.files?.[0]) {
            toast.error("Please upload both tweetImage and video.");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("content", content);
            formData.append("tweetImage", tweetImage.file.files[0]);

            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/tweets`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 201) {
                toast.success("Tweet Uploaded Successfully!");
                navigate("/tweets");
            }
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "response" in error) {
                // @ts-expect-error: error may have response property
                toast.error(error.response?.data?.message || error.message);
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full flex flex-col items-center pt-5">
            <div className="flex items-center pb-4">
                <button onClick={() => navigate('/upload-video')} className="px-3 py-2 rounded-l-md bg-neutral-50 text-sm cursor-pointer">Upload Video</button>
                <button className="px-3 py-2 rounded-r-md bg-neutral-200 text-sm">Upload Tweets</button>
            </div>
            <p className="text-lg font-medium text-neutral-700">Let's Broadcast your thoughts!!!</p>


            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center mt-5">
                <div className="w-full md:w-1/2">
                    <div className="flex flex-col gap-2 pb-3">
                        <label htmlFor="content" className="text-sm text-neutral-600 font-medium">Tweet content</label>
                        <textarea
                            required
                            value={content}
                            onChange={(e) => setcontent(e.target.value)}
                            id="content"
                            name="content"
                            className="border h-24 w-full rounded-md border-neutral-400 text-sm resize-none px-2 py-1 text-neutral-700 outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-500"
                            placeholder="Type content here ..."
                        />
                    </div>
                    {/* tweetImage Upload */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-neutral-600 font-medium">Tweet image</label>
                        <div className="relative w-full h-40 border border-neutral-300 rounded-lg flex items-center justify-center bg-neutral-100 overflow-hidden cursor-pointer">
                            {!tweetImage ? (
                                <label
                                    htmlFor="tweetImage"
                                    className="flex flex-col items-center gap-2 text-neutral-500 hover:text-neutral-700"
                                >
                                    <ImageIcon size={32} />
                                    <span className="text-xs">Click to Upload</span>
                                </label>
                            ) : (
                                <>
                                    <img
                                        src={tweetImage.previewURL}
                                        alt="tweetImage preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={removetweetImage}
                                        className="absolute top-2 right-2 bg-neutral-800 text-white rounded-full p-1 hover:bg-neutral-600"
                                    >
                                        <X size={16} />
                                    </button>
                                </>
                            )}
                            <input
                                type="file"
                                id="tweetImage"
                                name="tweetImage"
                                className="hidden"
                                accept="image/*"
                                onChange={handletweetImageChange}
                            />
                        </div>
                    </div>
                    <button className="flex ice justify-center px-4 py-2 mt-5 w-full rounded-md bg-neutral-800 text-white hover:bg-neutral-700 transition cursor-pointer">
                        {loading ? <Loader size={24} className="animate-spin"/> : "Publish Tweet"}
                    </button>
                </div>
            </form>

        </div>
    )
}

export default TweetUploadForm