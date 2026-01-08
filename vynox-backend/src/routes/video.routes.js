import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  likedVideos,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { incrementView } from "../controllers/view.controller.js";
import { clearHistory, createHistory, deleteHistory, getHistory } from "../controllers/watchHistroy.controller.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/")
  .get(getAllVideos)
  .post(
    upload.fields([
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    publishAVideo
  );

router
  .route("/:videoId")
  .get(getVideoById)
  .delete(deleteVideo)
  .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

// fetch video liked by user.
router.route("/user/liked").get(likedVideos);

// yeh view ko inc. karega.
router.route("/:videoId/view").post(incrementView);

// yaha se history ko manage kr rhe hai.
router.route("/:videoId/history").post(createHistory)
router.route("/delete-history/:watchedHistoryId").delete(deleteHistory)
router.route("/watched/clear-history").delete(clearHistory)
router.route("/watched/history").get(getHistory)

export default router;
