
# Vynox - Full Stack Video Platform

Vynox is a comprehensive YouTube-like video platform built with modern web technologies. This repository contains both the backend and frontend components of the application.

## Project Structure

```
Vynox/
├── README.md
├── vynox-backend/          # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # Express routes
│   │   ├── middlewares/    # Custom middleware
│   │   ├── services/       # Business logic services
│   │   ├── utils/          # Utility functions
│   │   ├── db/             # Database connection
│   │   ├── app.js          # Express app configuration
│   │   ├── index.js        # Server entry point
│   │   └── constants.js    # Application constants
│   ├── public/             # Static file uploads
│   ├── package.json
│   └── SECURITY.md
└── vynox-frontend/         # Frontend application (to be implemented)
```

## Backend Features

The Vynox backend is a Node.js + Express + MongoDB application that implements:
- User authentication with JWT + refresh tokens
- Video upload and streaming capabilities
- Social features (tweets, comments, likes)
- Playlist management
- Subscription system
- File uploads to Cloudinary
- Email services
- Device tracking and analytics

## Tech Stack

### Backend
- **Language**: JavaScript (ES modules)
- **Runtime**: Node.js (project uses "type": "module")
- **Web Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **File Storage**: Cloudinary for permanent storage, multer for temporary uploads
- **Authentication**: JWT access + refresh tokens (stored as cookies)
- **Email Service**: Nodemailer for email notifications
- **Device Tracking**: User agent parsing for analytics

### Frontend
- **Status**: To be implemented
- **Planned**: Modern React/Vue.js application with responsive design

## Quick Start

### Backend Setup

1. Navigate to the backend directory:
```bash
cd vynox-backend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The backend will start on the configured port (default: 8000).

## Environment Configuration

Create a `.env` file in the `vynox-backend` directory with the following variables:

### Required Environment Variables

```env
# Server Configuration
PORT=8000

# Database
MONGODB_URI=mongodb://localhost:27017/vynox

# JWT Authentication
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

**Note**: For local development without HTTPS, you may need to adjust cookie security settings in the authentication middleware.

## Architecture Overview

### Backend Architecture

- **File Upload Flow**: Files are temporarily stored in `public/` directory via multer middleware, then uploaded to Cloudinary with automatic cleanup of local files
- **Error Handling**: Consistent error responses using `ApiError` and `ApiResponse` utilities
- **Authentication**: JWT-based authentication with access and refresh tokens stored as HTTP-only cookies
- **Database**: MongoDB with Mongoose ODM, using aggregation pipelines for complex queries and pagination
- **Transactions**: Critical operations (likes, subscriptions, playlists) use MongoDB transactions for data consistency
- **Email Services**: Nodemailer integration for user notifications and system emails
- **Device Analytics**: User agent parsing for device tracking and analytics

## Database Models

### Core Models

- **User Model**
  - Fields: username, email, fullName, avatar, coverImage, watchHistory, password, refreshToken
  - Methods: `isPasswordCorrect()`, `generateAccessToken()`, `generateRefreshToken()`

- **Video Model**
  - Fields: videoFile, thumbnail, title, description, duration, views, likeCount, isPublished, owner
  - References: User (owner)

- **Comment Model**
  - Fields: content, video (reference), isEdited, likeCount, owner
  - References: Video, User

- **Like Model**
  - Fields: video, comment, tweet, likedBy
  - References: Video/Comment/Tweet, User

- **Tweet Model**
  - Fields: content, tweetImage, isEdited, likeCount, owner
  - References: User

- **Playlist Model**
  - Fields: name, description, videos (array), owner
  - References: User, Video[]

- **Subscription Model**
  - Fields: subscriber, channel
  - References: User (both fields)

## Middleware & Utilities

### Middleware

- **`verifyJWT`** - Authentication middleware that validates JWT tokens from cookies or Authorization headers
- **`upload`** - Multer middleware for file uploads with unique filename generation

### Utility Functions

- **`ApiError`** - Standardized error handling class for consistent error responses
- **`ApiResponse`** - Response wrapper with standardized JSON structure
- **`asyncHandler`** - Async function wrapper for automatic error handling
- **`cloudinary.js`** - Cloudinary integration for file upload and deletion
- **`device.js`** - User agent parsing for device analytics
- **`MailTemplates.js`** - Email template management
- **`UrlChecker.js`** - URL validation utilities

## API Endpoints

All API routes are prefixed with `/api/v1`. The backend provides comprehensive RESTful endpoints for all platform features.

### Authentication & User Management (`/api/v1/users`)

- **POST /register** - User registration with avatar upload
- **POST /login** - User authentication with JWT tokens
- **POST /logout** - User logout and token cleanup
- **POST /refresh-token** - Refresh access token
- **PATCH /change-password** - Password change (authenticated)
- **GET /current-user** - Get current user profile (authenticated)
- **PATCH /update-account** - Update user account details (authenticated)
- **PATCH /avatar** - Update user avatar (authenticated)
- **PATCH /cover-image** - Update cover image (authenticated)
- **GET /c/:username** - Get user channel profile (authenticated)
- **GET /history** - Get user watch history (authenticated)

### Video Management (`/api/v1/videos`)

- **GET /** - List videos with filtering and pagination
- **POST /** - Upload new video with thumbnail (authenticated)
- **GET /:videoId** - Get video details and metadata
- **DELETE /:videoId** - Delete video (owner only)
- **PATCH /:videoId** - Update video details (owner only)
- **PATCH /toggle/publish/:videoId** - Toggle video publication status (owner only)

### Social Features

#### Tweets (`/api/v1/tweets`)
- **POST /** - Create tweet with optional image (authenticated)
- **GET /user/:userId** - Get user tweets with pagination
- **PATCH /:tweetId** - Update tweet content (authenticated)
- **DELETE /:tweetId** - Delete tweet (authenticated)

#### Comments (`/api/v1/comments`)
- **GET /:videoId** - Get video comments with pagination
- **POST /:videoId** - Add comment to video (authenticated)
- **PATCH /c/:commentId** - Update comment (owner only)
- **DELETE /c/:commentId** - Delete comment (owner only)

#### Likes (`/api/v1/likes`)
- **POST /toggle/v/:videoId** - Toggle video like (authenticated)
- **POST /toggle/c/:commentId** - Toggle comment like (authenticated)
- **POST /toggle/t/:tweetId** - Toggle tweet like (authenticated)
- **GET /videos** - Get liked videos (authenticated)

### Subscription System (`/api/v1/subscriptions`)
- **POST /c/:channelId** - Toggle channel subscription (authenticated)
- **GET /c/:subscriberId** - Get user subscriptions (authenticated)

### Playlist Management (`/api/v1/playlist`)
- **POST /** - Create new playlist (authenticated)
- **GET /user/:userId** - Get user playlists
- **GET /:playlistId** - Get playlist details and videos
- **PATCH /:playlistId** - Update playlist details (owner only)
- **PATCH /add/:playlistId** - Add videos to playlist (authenticated)
- **PATCH /remove/:playlistId** - Remove videos from playlist (authenticated)
- **DELETE /:playlistId** - Delete playlist (owner only)

### Dashboard & Analytics (`/api/v1/dashboard`)
- **GET /stats/:channelId** - Get channel statistics
- **GET /videos** - Get all videos with analytics

### System (`/api/v1/healthcheck`)
- **GET /** - System health check endpoint

## Error Handling & Response Format

### Standardized Error Handling

- **`ApiError`** - Custom error class for consistent error responses
- **`ApiResponse`** - Standardized success response wrapper
- **Global Error Handler** - Centralized error processing and formatting

### Common HTTP Status Codes

- **400** - Bad Request (invalid ObjectId, validation errors)
- **401** - Unauthorized (invalid/expired tokens, authentication required)
- **404** - Not Found (resource doesn't exist)
- **500** - Internal Server Error (database issues, server errors)

### Response Format

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success message",
  "success": true
}
```

## Implementation Details

### Authentication Flow
- JWT access tokens (short-lived) + refresh tokens (long-lived)
- Refresh tokens stored in database and HTTP-only cookies
- Automatic token refresh mechanism for seamless user experience

### File Upload Process
1. Files temporarily stored in `public/` directory via multer
2. Upload to Cloudinary for permanent storage
3. Automatic cleanup of temporary local files
4. Support for images (avatars, thumbnails, tweet images) and videos

### Data Consistency
- MongoDB transactions for critical operations (likes, subscriptions, playlists)
- Aggregation pipelines for complex queries and pagination
- Referential integrity with proper model relationships

### Performance Optimizations
- Mongoose aggregation for efficient data retrieval
- Pagination support across all list endpoints
- Optimized queries with proper indexing
- Cloudinary integration for optimized media delivery

## API Usage Examples

### User Registration
```bash
curl -X POST http://localhost:8000/api/v1/users/register \
  -F "fullName=John Doe" \
  -F "email=john@example.com" \
  -F "username=johndoe" \
  -F "password=password123" \
  -F "avatar=@/path/to/avatar.jpg"
```

### User Login
```bash
curl -X POST http://localhost:8000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'
```

### Upload Video (Authenticated)
```bash
curl -X POST http://localhost:8000/api/v1/videos/ \
  -H "Cookie: accessToken=your_jwt_token" \
  -F "title=My Video" \
  -F "description=Video description" \
  -F "videoFile=@/path/to/video.mp4" \
  -F "thumbnail=@/path/to/thumbnail.jpg"
```

## Development Roadmap

### Completed Features ✅
- User authentication and authorization
- Video upload and management
- Social features (tweets, comments, likes)
- Playlist management
- Subscription system
- Email notifications
- Device analytics
- File upload with Cloudinary integration

### Planned Features 🚧
- Frontend React/Vue.js application
- Real-time notifications
- Advanced video analytics
- Content moderation
- API rate limiting
- Comprehensive test suite
- Docker containerization

## Testing

### Current Status
- No automated tests currently implemented
- Manual testing via Postman/curl recommended

### Recommended Testing Strategy
- **Unit Tests**: Test utility functions, models, and controllers
- **Integration Tests**: Test complete user flows (register → login → upload → interact)
- **API Tests**: Test all endpoints with various scenarios
- **Database Tests**: Test with test database for data consistency

## Contributing

We welcome contributions to Vynox! Please follow these guidelines:

1. **Code Style**: Follow ES modules, use `asyncHandler` wrapper, maintain `ApiError`/`ApiResponse` consistency
2. **Branching**: Create feature branches for new functionality
3. **Testing**: Add tests for new features and bug fixes
4. **Documentation**: Update README and API documentation as needed

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License - see the `package.json` file for details.

## Credits & Acknowledgments

### Project Author
- **Rohan Kumar Mahto** - Full-stack developer and project architect
  - GitHub: [@Rohan04022003](https://github.com/Rohan04022003)
  - Portfolio: [rohan-portfolio-eta.vercel.app](https://rohan-portfolio-eta.vercel.app/)
  - LinkedIn: [rohan-mahto-5521aa253](https://www.linkedin.com/in/rohan-mahto-5521aa253/)

### Course Instructor
- **Hitesh Choudhary** - Provided foundational authentication concepts and guidance

### Special Thanks
- The open-source community for the amazing tools and libraries
- All contributors and users who help improve Vynox

---

## Support

If you find Vynox helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🤝 Contributing to the codebase

For questions or support, please open an issue on GitHub or contact the project maintainer.

