
# YT-Clone Backend

This repository contains the backend for a YouTube-like application built during the "chai aur code" series. It is a Node.js + Express + MongoDB application that implements user authentication (JWT + refresh tokens), video/tweet/comment/like/playlist/subscription features, and file uploads to Cloudinary.

This README documents the whole project: setup, environment variables, API routes (every endpoint), models, middleware, utilities, and example flows so nothing is missed.

## Quick facts

- Language: JavaScript (ES modules)
- Runtime: Node.js (project uses "type": "module")
- Web framework: Express
- Database: MongoDB (mongoose)
- File uploads: multer (stored in `public/`), Cloudinary for permanent storage
- Auth: JWT access + refresh tokens (stored as cookies)
- Main start script (dev): `npm run dev`
- DB name constant: `youtube-clone`

## Project structure (high level)

- `src/`
	- `app.js` — express app, middleware and route registration
	- `index.js` — dotenv loading and server + DB bootstrap
	- `constants.js` — DB name
	- `db/index.js` — mongoose connection
	- `controllers/` — route handlers (user, video, tweet, comment, like, playlist, subscription, dashboard, healthcheck)
	- `models/` — mongoose models (User, Video, Comment, Like, Tweet, Playlist, Subscription)
	- `routes/` — Express routers that map endpoints to controllers
	- `middlewares/` — `auth.middleware.js` (JWT verification) and `multer.middleware.js` (file upload)
	- `utils/` — `ApiError`, `ApiResponse`, `asyncHandler`, Cloudinary helpers
- `public/` — temporary storage for multer uploads

## Environment variables

Create a `.env` at project root with at least the following variables (names referenced directly in code):

- `PORT` — port to run the server (e.g., 8000)
- `MONGODB_URI` — MongoDB connection string (without database name; `db/index.js` will append `/${DB_NAME}`)
- `ACCESS_TOKEN_SECRET` — JWT secret for access tokens
- `REFRESH_TOKEN_SECRET` — JWT secret for refresh tokens
- `ACCESS_TOKEN_EXPIRY` — e.g. `15m` or `1h`
- `REFRESH_TOKEN_EXPIRY` — e.g. `7d`
- `CLOUDINARY_NAME` — Cloudinary cloud name
- `CLOUDINARY_API_KEY` — Cloudinary API key
- `CLOUDINARY_API_SECRET` — Cloudinary API secret
- `CORS_ORIGIN` — allowed origin for CORS

Note: The code expects cookies to be set with `secure: true` for tokens; in local development you may need to adapt cookie options if not using HTTPS.

## Install & Run

1. Install dependencies

```powershell
cd "d:\Full Stack Web Development\Backend Development Course\Hitesh Udemy Course\chai-backend-youtube\chai-backend-main"
npm install
```

2. Start in dev mode (uses nodemon and dotenv):

```powershell
npm run dev
```

By default the dev script runs: `nodemon -r dotenv/config --experimental-json-modules src/index.js`.

## High-level behavior / routines

- File uploads are first written to `public/` by `multer` middleware. The Cloudinary helper `uploadOnCloudinary` uploads the file to Cloudinary and removes the temporary file from `public/`.
- Errors thrown within controllers use `ApiError` (status, message) and responses use `ApiResponse` to keep consistent JSON shapes.
- Auth is enforced using `verifyJWT` middleware that extracts the access token from the `accessToken` cookie or the `Authorization: Bearer <token>` header.
- Many controllers use Mongoose aggregation pipelines for efficient lookups and pagination.
- Some operations (likes, subscriptions, playlist modifications) use Mongoose sessions/transactions where multiple documents must be consistent.

## Models (brief overview)

- User
	- username, email, fullName, avatar ({url, public_id}), coverImage, watchHistory, password (hashed), refreshToken
	- helper methods: `isPasswordCorrect`, `generateAccessToken`, `generateRefreshToken`

- Video
	- videoFile {url, public_Id}, thumbnail {url, public_Id}, title, description, duration, views, likeCount, isPublished, owner

- Comment
	- content, video (ref), isEdited, likeCount, owner

- Like
	- fields to reference liked resource: video, comment, tweet and likedBy

- Tweet
	- content, tweetImage {url, public_Id}, isEdited, likeCount, owner

- Playlist
	- name, description, videos [ObjectId], owner

- Subscription
	- subscriber (User), channel (User)

## Middlewares

- `verifyJWT` — ensures the request is authenticated. It reads the access token from `req.cookies.accessToken` or `Authorization` header and attaches the `req.user` (without password and refreshToken) after verification.
- `upload` (multer) — writes uploaded files to `public/` with `diskStorage` and unique filenames: `Date.now()-originalname`.

## Utils

- `ApiError` — central error type. Controllers throw this for structured errors.
- `ApiResponse` — standard response wrapper with `{ statusCode, data, message, success }` shape.
- `asyncHandler` — small helper to wrap async controllers and forward errors to express's error handler.
- `cloudinary.js` — `uploadOnCloudinary` uploads and removes the local file; `deleteFromCloudinary` removes resources by public id.

## All API routes (detailed)

All routes are prefixed by `/api/v1` in `src/app.js`.

- Healthcheck
	- GET /api/v1/healthcheck/ — returns the healthcheck response (controller currently placeholder)

- Users (`/api/v1/users`)
	- POST /register — register user
		- multipart/form-data with fields:
			- `avatar` (file, required)
			- `coverImage` (file, optional)
			- body fields: `fullName`, `email`, `username`, `password`
		- Response: created user (without password/refreshToken)

	- POST /login — login
		- JSON: `{ email?, username?, password }` (either email or username required)
		- Returns cookies `accessToken` and `refreshToken` and JSON with user and tokens

	- POST /logout — (auth) clears tokens and unsets refreshToken in DB

	- POST /refresh-token — refresh access token
		- Accepts cookie `refreshToken` or body `refreshToken`. Issues new access and refresh tokens and sets them as cookies.

	- PATCH /change-password — (auth) `{ oldPassword, newPassword }`

	- GET /current-user — (auth) returns `req.user` info

	- PATCH /update-account — (auth) `{ fullName, email }` updates user fields

	- PATCH /avatar — (auth) upload single `avatar` file; endpoint updates avatar and removes old avatar in Cloudinary

	- PATCH /cover-image — (auth) upload single `coverImage` file; updates and removes old cover image

	- GET /c/:username — (auth) fetch user channel profile by username

	- GET /history — (auth) get watch history

- Tweets (`/api/v1/tweets`) (all authenticated)
	- POST / — upload tweet with optional image
		- `multipart/form-data` field: `tweetImage` (file) and `content` (body)
	- GET /user/:userId — get tweets of a user (query: `sortType`, `limit`, `page`)
	- PATCH /:tweetId — update tweet content
	- DELETE /:tweetId — delete tweet (removes image from Cloudinary)

- Subscriptions (`/api/v1/subscriptions`) (auth)
	- POST /c/:channelId — toggle subscription for channelId
	- GET /c/:subscriberId — list channels a user is subscribed to

- Videos (`/api/v1/videos`) (auth)
	- GET / — list videos (query: `page`, `limit`, `query`, `sortBy`, `sortType`, `userId`)
	- POST / — publish a video
		- `multipart/form-data` with `videoFile` (file, maxCount:1) and `thumbnail` (file, maxCount:1)
		- body: `title`, `description`
	- GET /:videoId — get video details (includes owner, short comments, subscription status)
	- DELETE /:videoId — delete a video (owner only; deletes cloudinary assets)
	- PATCH /:videoId — update video (owner only) expects single `thumbnail` file and `title`, `description` fields
	- PATCH /toggle/publish/:videoId — toggle `isPublished` (owner only)

- Comments (`/api/v1/comments`) (auth)
	- GET /:videoId — list comments for a video (query `page`, `limit`)
	- POST /:videoId — add a comment to a video. Body: `{ content }`
	- PATCH /c/:commentId — update comment (owner only) `{ content }`
	- DELETE /c/:commentId — delete comment (owner only)

- Likes (`/api/v1/likes`) (auth)
	- POST /toggle/v/:videoId — toggle like on video
	- POST /toggle/c/:commentId — toggle like on comment
	- POST /toggle/t/:tweetId — toggle like on tweet
	- GET /videos — get videos liked by the current user (query `limit`, `page`, `sortType`)

- Playlists (`/api/v1/playlist`) (auth)
	- POST / — create playlist `{ name, description }`
	- GET /user/:userId — get playlists of a user
	- GET /:playlistId — get playlist details and videos
	- PATCH /:playlistId — update playlist `{ name?, description? }` (owner only)
	- PATCH /add/:playlistId — add videos to playlist body `videos` (array or single id)
	- PATCH /remove/:playlistId — remove videos from playlist body `videos` (array or single id)
	- DELETE /:playlistId — delete playlist (owner only)

- Dashboard (`/api/v1/dashboard`) (auth)
	- GET /stats/:channelId — get channel stats (total videos, views, likes, subscribers, isSubscribed)
	- GET /videos — get all videos with owner info (sorted by createdAt desc)

## Error handling

Controllers throw `ApiError(statusCode, message)` for expected errors and let the global express error handler (not included explicitly in the repository snapshot) format responses consistently. Successful responses use `ApiResponse(statusCode, data, message)`.

Common error cases seen in the code:
- Invalid ObjectId checks -> 400
- Not found -> 404
- Unauthorized access or invalid tokens -> 401
- Server errors / DB issues -> 500

## Important implementation details & notes

- Tokens: When a user logs in, access and refresh tokens are generated. The refresh token is saved in the User document and returned as an HTTP-only cookie. `refreshAccessToken` validates the refresh token and issues new tokens.
- Uploads: multer writes to `public/` and Cloudinary helpers move these to Cloudinary and delete local temp files.
- Transactions: `toggleVideoLike`, comment likes, subscription toggles and some playlist operations use mongoose sessions to ensure consistency when updating multiple documents.
- Aggregations: Several endpoints use aggregation pipelines for lookups, pagination, and computed fields (e.g., totalLikes, isSubscribed, totalSubscribers, slicing comments).

## Example flows (Postman / curl style)

- Register (multipart/form-data):

	- POST /api/v1/users/register
	- Form fields: `fullName`, `email`, `username`, `password`, and file fields `avatar` (required), `coverImage` (optional)

- Login:

	- POST /api/v1/users/login
	- JSON: `{ "email": "you@example.com", "password": "pass" }`

	Response sets cookies `accessToken` and `refreshToken`.

- Publish a video (authenticated):

	- POST /api/v1/videos/
	- multipart/form-data: files `videoFile` and `thumbnail`, fields `title` and `description`

Notes: When testing locally and not using HTTPS, you may need to adjust cookie `secure` setting in `user.controller` to `false` so the browser/Postman accepts cookies over HTTP.

## Development notes & TODOs observed in code

- `healthcheck.controller.js` has a TODO placeholder — implement a response body indicating service health.
- Some controllers log and swallow certain errors; when adding a global error handler ensure `ApiError` is respected and returned consistently.

## Tests

There are no automated tests included in the repo snapshot. Recommended next steps:

- Add unit tests for helper utils (`cloudinary`, `ApiError`) and controllers using a test DB (Jest + supertest).
- Add integration tests for core flows: register -> login -> publish video -> comment -> like -> delete.

## Contributing

Feel free to open issues or create PRs. Follow existing code style (ES modules, asyncHandler wrapper, ApiError/ApiResponse) and keep destructuring and aggregation pipelines consistent.

## License

The project uses ISC in `package.json`.

## Credits & Author

This project was built by Rohan Kumar Mahto. Important notes on contribution and credit:

- Instructor credit: Hitesh Choudhary (the course author) taught and demonstrated the user authentication portion only. The rest of the logic, endpoints, controllers, aggregation pipelines, and integrations (videos, tweets, comments, likes, playlists, subscriptions, Cloudinary wiring, transactions, etc.) were implemented by Rohan Kumar Mahto.

- Author / Contact:
	- Name: Rohan Kumar Mahto
	- GitHub: https://github.com/Rohan04022003
	- This repository: https://github.com/Rohan04022003/yt-clone-backend
	- Portfolio: https://rohan-portfolio-eta.vercel.app/
	- LinkedIn: https://www.linkedin.com/in/rohan-mahto-5521aa253/
	- Instagram: https://www.instagram.com/rohankumarmahto01/

If you use this project or base your work on it, a star on the repository or a mention is appreciated.
---

If you want, I can now:

- generate a Postman collection (JSON) for all endpoints,
- add a minimal `.env.example` file that lists required env variables, or
- implement the missing healthcheck response and a simple global error handler.

Tell me which of the above you'd like next.

