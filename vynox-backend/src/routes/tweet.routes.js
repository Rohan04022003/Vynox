import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getAllTweets,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  getSavedTweet,
  toggleSaveTweet,
} from "../controllers/saveTweet.controller.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").get(getAllTweets);
router.route("/").post(upload.single("tweetImage"), createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

// save tweets.
router.route("/saved").get(getSavedTweet);
router.route("/save/:tweetId").post(toggleSaveTweet);
export default router;