# Phase 2: Social Feed System - Development Guide

## Overview

Phase 2 implements a complete social feed system for the Baking Atelier community platform. This includes casual post creation, engagement features (likes, comments), content reporting, and user recommendations.

**Completion Status:** ~75% complete with 25% TODO items for Phase 3 and beyond.

---

## New Project Structure

### Backend Changes (Server)

```
server/src/
├── models/
│   ├── Post.js              [NEW] - Casual post schema
│   ├── Comment.js           [NEW] - Comment schema
│   ├── Report.js            [NEW] - Content report schema
│   └── User.js              [EXISTING]
├── controllers/
│   ├── postController.js    [NEW] - Post CRUD + engagement
│   ├── commentController.js [NEW] - Comment operations
│   ├── reportController.js  [NEW] - Reporting system
│   └── authController.js    [EXISTING]
├── routes/
│   ├── postRoutes.js        [NEW] - POST /api/posts/* routes
│   ├── commentRoutes.js     [NEW] - POST /api/posts/:postId/comments/*
│   ├── reportRoutes.js      [NEW] - POST /api/reports/* routes
│   └── authRoutes.js        [EXISTING]
├── validators/
│   ├── feedValidators.js    [NEW] - Post/comment/report validation
│   └── authValidators.js    [EXISTING]
├── middleware/
│   ├── asyncHandler.js      [EXISTING]
│   ├── authMiddleware.js    [EXISTING]
│   ├── errorHandler.js      [EXISTING]
│   ├── validateRequest.js   [EXISTING]
│   └── notFoundHandler.js   [EXISTING]
└── server.js                [UPDATED] - New route registrations
```

### Frontend Changes (Client)

```
client/src/
├── api/
│   ├── postApi.js           [NEW] - Post API client
│   ├── commentApi.js        [NEW] - Comment API client
│   ├── reportApi.js         [NEW] - Report API client
│   ├── authApi.js           [EXISTING]
│   └── http.js              [EXISTING]
├── components/
│   ├── feed/                [NEW FOLDER]
│   │   ├── Feed.jsx         [NEW] - Main feed component
│   │   ├── PostCard.jsx     [NEW] - Individual post display
│   │   ├── CreatePostForm.jsx   [NEW] - Post creation
│   │   ├── CommentSection.jsx   [NEW] - Comments UI
│   │   ├── LikeButton.jsx   [NEW] - Like/unlike button
│   │   ├── ReportButton.jsx [NEW] - Report modal
│   │   ├── UserRecommendations.jsx [NEW] - Sidebar recommendations
│   │   ├── Feed.css         [NEW]
│   │   ├── PostCard.css     [NEW]
│   │   ├── CreatePostForm.css   [NEW]
│   │   ├── CommentSection.css   [NEW]
│   │   ├── LikeButton.css   [NEW]
│   │   ├── ReportButton.css [NEW]
│   │   └── UserRecommendations.css [NEW]
│   └── layout/              [EXISTING]
├── pages/
│   ├── DashboardPage.jsx    [UPDATED] - Integrated feed system
│   └── [others]             [EXISTING]
├── context/
│   ├── AuthContext.jsx      [EXISTING]
│   └── ThemeContext.jsx     [EXISTING]
├── styles/
│   └── global.css           [UPDATED] - Feed CSS variables + button styles
└── [other files]            [EXISTING]
```

---

## Database Schema Relationships

### Post Model

```javascript
{
  _id: ObjectId,
  authorId: ObjectId (ref: User),
  authorName: String,
  caption: String (1-2000 chars),
  likesCount: Number,
  commentsCount: Number,
  likes: [
    { userId: ObjectId (ref: User) }
  ],
  comments: [ObjectId (ref: Comment)],
  isDeleted: Boolean,
  timestamps: { createdAt, updatedAt }
}
```

**Key Indexes:**
- `{ createdAt: -1 }` - Feed sorting
- `{ authorId: 1, createdAt: -1 }` - User posts
- Denormalized counts for performance (avoid N+1 queries)

### Comment Model

```javascript
{
  _id: ObjectId,
  authorId: ObjectId (ref: User),
  authorName: String,
  postId: ObjectId (ref: Post),
  text: String (1-500 chars),
  likesCount: Number,
  isDeleted: Boolean,
  timestamps: { createdAt, updatedAt }
}
```

**Key Indexes:**
- `{ postId: 1, createdAt: 1 }` - Fetch comments for a post
- `{ authorId: 1, createdAt: -1 }` - User's comments

### Report Model

```javascript
{
  _id: ObjectId,
  reporterId: ObjectId (ref: User),
  reportedType: String (enum: "post", "comment"),
  reportedId: ObjectId,
  reason: String (enum: "inappropriate", "spam", "harassment", "offensive", "other"),
  status: String (enum: "pending", "reviewed", "resolved"),
  isDuplicate: Boolean,
  timestamps: { createdAt, updatedAt }
}
```

**Key Indexes:**
- `{ status: 1, createdAt: -1 }` - Admin moderation dashboard
- `{ reportedType: 1, reportedId: 1 }` - Find reports about specific content
- `{ reporterId: 1, createdAt: -1 }` - User report history

### Relationships

```
User (1) ──┬─→ (Many) Post
           ├─→ (Many) Comment
           └─→ (Many) Report

Post (1) ──┬─→ (Many) Like { userId }
           ├─→ (Many) Comment
           └─→ (Many) Report

Comment (1) ──→ (Many) Report
```

---

## API Endpoints

### Post Endpoints

| Method | URL | Protected | Description |
|--------|-----|-----------|-------------|
| POST | `/api/posts` | ✅ | Create new post |
| GET | `/api/posts` | ❌ | Fetch feed (paginated) |
| GET | `/api/posts/:postId` | ❌ | Get single post |
| POST | `/api/posts/:postId/like` | ✅ | Like a post |
| DELETE | `/api/posts/:postId/like` | ✅ | Unlike a post |
| DELETE | `/api/posts/:postId` | ✅ | Delete own post |
| GET | `/api/posts/user/:userId` | ❌ | Get user's posts |

### Comment Endpoints

| Method | URL | Protected | Description |
|--------|-----|-----------|-------------|
| POST | `/api/posts/:postId/comments` | ✅ | Create comment |
| GET | `/api/posts/:postId/comments` | ❌ | Fetch post's comments |
| GET | `/api/comments/:commentId` | ❌ | Get single comment |
| DELETE | `/api/comments/:commentId` | ✅ | Delete own comment |
| GET | `/api/comments/user/:userId` | ❌ | Get user's comments |

### Report Endpoints

| Method | URL | Protected | Description |
|--------|-----|-----------|-------------|
| POST | `/api/reports` | ✅ | Submit content report |
| GET | `/api/reports` | ✅ | Get all reports (TODO: admin only) |
| GET | `/api/reports/:reportId` | ✅ | Get single report (TODO: admin only) |
| PATCH | `/api/reports/:reportId` | ✅ | Update report status (TODO: admin only) |
| GET | `/api/reports/user/:userId` | ✅ | Get reporter's reports |

---

## API Request/Response Examples

### Create Post

```bash
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "caption": "Just baked my first sourdough! 🍞"
}
```

**Response (201):**
```json
{
  "message": "Post created successfully",
  "post": {
    "id": "507f1f77bcf86cd799439011",
    "caption": "Just baked my first sourdough! 🍞",
    "authorId": "507f1f77bcf86cd799439010",
    "authorName": "Sarah Baker",
    "likesCount": 0,
    "commentsCount": 0,
    "createdAt": "2024-05-15T10:30:00Z",
    "updatedAt": "2024-05-15T10:30:00Z"
  }
}
```

### Fetch Feed

```bash
GET /api/posts?skip=0&limit=10
```

**Response (200):**
```json
{
  "posts": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "caption": "Amazing chocolate cake! 🎂",
      "authorName": "Emma",
      "authorId": "507f1f77bcf86cd799439012",
      "likesCount": 5,
      "commentsCount": 2,
      "likes": [
        { "userId": "507f1f77bcf86cd799439013" }
      ],
      "comments": ["507f1f77bcf86cd799439014"],
      "createdAt": "2024-05-15T09:00:00Z"
    }
  ],
  "pagination": {
    "skip": 0,
    "limit": 10,
    "total": 42,
    "hasMore": true
  }
}
```

### Like Post

```bash
POST /api/posts/507f1f77bcf86cd799439011/like
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Post liked",
  "likesCount": 6
}
```

### Create Comment

```bash
POST /api/posts/507f1f77bcf86cd799439011/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Looks delicious! What's your secret ingredient?"
}
```

**Response (201):**
```json
{
  "message": "Comment created successfully",
  "comment": {
    "id": "507f1f77bcf86cd799439020",
    "text": "Looks delicious! What's your secret ingredient?",
    "authorId": "507f1f77bcf86cd799439013",
    "authorName": "Marco",
    "postId": "507f1f77bcf86cd799439011",
    "createdAt": "2024-05-15T10:45:00Z"
  }
}
```

### Submit Report

```bash
POST /api/reports
Authorization: Bearer <token>
Content-Type: application/json

{
  "reportedType": "post",
  "reportedId": "507f1f77bcf86cd799439011",
  "reason": "inappropriate"
}
```

**Response (201):**
```json
{
  "message": "Report submitted successfully",
  "report": {
    "id": "507f1f77bcf86cd799439030",
    "reportedType": "post",
    "reportedId": "507f1f77bcf86cd799439011",
    "reason": "inappropriate",
    "status": "pending",
    "createdAt": "2024-05-15T11:00:00Z"
  }
}
```

---

## Frontend-Backend Communication Flow

### Posting a Casual Post

```
User clicks "Create Post" button
        ↓
DashboardPage shows CreatePostForm modal
        ↓
User types caption and clicks "Post"
        ↓
CreatePostForm validates input
        ↓
postApi.create(caption) → HTTP POST /api/posts
        ↓
Backend: postController.createPost()
  - Creates Post document
  - Saves to MongoDB
  - Returns post data
        ↓
Frontend receives response
        ↓
DashboardPage.setFeedRefreshTrigger(+1)
  - Triggers Feed component to reload
        ↓
Feed component: loadPosts()
  - postApi.getAll(0, 10) → HTTP GET /api/posts
        ↓
Backend: postController.getPosts()
  - Queries all non-deleted posts
  - Returns paginated results
        ↓
Frontend displays updated feed with new post
        ↓
User sees their post at top of feed
```

### Liking a Post

```
User clicks heart icon on post
        ↓
PostCard: LikeButton optimistic update
  - Immediately shows liked state
  - Increments counter
        ↓
onLike() → postApi.like(postId)
  - HTTP POST /api/posts/:postId/like
        ↓
Backend: postController.likePost()
  - Checks if user already liked
  - Adds user ID to post.likes array
  - Increments likesCount
  - Saves to MongoDB
  - Returns new count
        ↓
Frontend receives response
  - If error: revert optimistic UI
  - If success: keep UI updated
        ↓
User sees like reflected instantly
```

### Adding a Comment

```
User clicks "💬" button on post
        ↓
CommentSection opens/closes
        ↓
User types in comment input
        ↓
User clicks "Post" comment button
        ↓
CommentSection validates input (1-500 chars)
        ↓
commentApi.create(postId, text)
  - HTTP POST /api/posts/:postId/comments
        ↓
Backend: commentController.createComment()
  - Validates postId exists
  - Creates Comment document
  - Adds comment._id to post.comments array
  - Increments post.commentsCount
  - Saves both documents
  - Returns comment data
        ↓
Frontend receives response
        ↓
CommentSection adds comment to local list
        ↓
Post card updates commentsCount
        ↓
User sees comment instantly
```

### Reporting Content

```
User clicks "🚩" button on post/comment
        ↓
ReportButton opens modal
        ↓
User selects reason
        ↓
User clicks "Submit Report"
        ↓
reportApi.create(type, id, reason)
  - HTTP POST /api/reports
        ↓
Backend: reportController.createReport()
  - Validates reported content exists
  - Creates Report document
  - Sets status = "pending"
  - Saves to MongoDB
  - Returns report data
        ↓
Frontend receives response
        ↓
ReportButton shows success message
        ↓
Modal auto-closes after 2 seconds
        ↓
User receives confirmation
```

---

## Setup & Installation

### 1. Backend Dependencies

No new npm packages needed! Phase 2 uses existing dependencies:
- mongoose (models)
- express-validator (validation)
- express (routing)

Verify your `server/package.json` has:
```json
{
  "dependencies": {
    "mongoose": "^7+",
    "express": "^4.18+",
    "express-validator": "^7+",
    "dotenv": "^16+",
    "jsonwebtoken": "^9+",
    "cors": "^2.8+",
    "morgan": "^1.10+"
  }
}
```

If needed, install:
```bash
cd server
npm install
```

### 2. Frontend Dependencies

No new npm packages needed! Phase 2 uses:
- React hooks (useState, useEffect, useContext)
- Axios (already installed via http client)

Verify `client/package.json` has axios in dependencies.

### 3. Database Models

Models are automatically registered when you import them in server.js:

```javascript
import { Post } from "./models/Post.js";
import { Comment } from "./models/Comment.js";
import { Report } from "./models/Report.js";
```

MongoDB collections are auto-created on first document insert.

### 4. Environment Variables

No new variables needed. Existing setup works:

**server/.env:**
```
MONGO_URI=mongodb://localhost:27017/baking_atlier
PORT=5000
JWT_SECRET=your_jwt_secret
CLIENT_ORIGIN=http://localhost:5173
```

**client/.env:**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Testing Instructions

### Manual Testing with Postman

#### 1. Setup Authentication
1. Register/Login first to get a token
2. Copy the token from response
3. In Postman, create a new request
4. Add header: `Authorization: Bearer <token>`

#### 2. Test Create Post
```
POST http://localhost:5000/api/posts
Headers: Authorization: Bearer <token>
Body (JSON):
{
  "caption": "My first post! Testing Phase 2 🎉"
}
```
Expected: 201 with post data

#### 3. Test Fetch Posts
```
GET http://localhost:5000/api/posts?skip=0&limit=10
```
Expected: 200 with posts array

#### 4. Test Like Post
```
POST http://localhost:5000/api/posts/{postId}/like
Headers: Authorization: Bearer <token>
```
Expected: 200 with likesCount

#### 5. Test Unlike Post
```
DELETE http://localhost:5000/api/posts/{postId}/like
Headers: Authorization: Bearer <token>
```
Expected: 200 with likesCount

#### 6. Test Create Comment
```
POST http://localhost:5000/api/posts/{postId}/comments
Headers: Authorization: Bearer <token>
Body (JSON):
{
  "text": "Great post!"
}
```
Expected: 201 with comment data

#### 7. Test Fetch Comments
```
GET http://localhost:5000/api/posts/{postId}/comments?skip=0&limit=10
```
Expected: 200 with comments array

#### 8. Test Submit Report
```
POST http://localhost:5000/api/reports
Headers: Authorization: Bearer <token>
Body (JSON):
{
  "reportedType": "post",
  "reportedId": "{postId}",
  "reason": "inappropriate"
}
```
Expected: 201 with report data

### End-to-End Testing in Browser

1. **Start Backend:**
   ```bash
   cd server
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd client
   npm run dev
   ```

3. **Test Flow:**
   - Navigate to http://localhost:5173
   - Login/Signup
   - Go to Dashboard
   - Click "✏️ Create Post"
   - Write a casual post
   - Click "Post"
   - See post appear in feed
   - Click heart to like
   - Click comment icon
   - Add a comment
   - Click report flag
   - Submit a report

---

## Debugging Tips

### Issue: Posts don't appear in feed

**Check:**
1. Backend logs: `npm run dev` in server folder
2. MongoDB connection: Check that MONGO_URI is correct
3. Network tab in DevTools: Verify GET /api/posts returns 200
4. Console errors: Check browser console for React errors

**Debug:**
```javascript
// Add to Feed.jsx loadPosts():
console.log("Posts fetched:", fetchedPosts);
console.log("Pagination:", pagination);
```

### Issue: Like button doesn't work

**Check:**
1. Authorization header: Verify Bearer token is sent
2. Backend authMiddleware: Check req.user is populated
3. Network tab: Is POST /api/posts/:id/like returning 200?
4. Post data: Does post have `likes` array?

**Debug:**
```javascript
// In postController.js likePost():
console.log("User ID:", userId);
console.log("Post likes before:", post.likes);
console.log("Post likes after:", post.likes);
```

### Issue: Comments show but count doesn't update

**Check:**
1. Post.commentsCount vs actual comments.length
2. Denormalized count is updated when comment created
3. Frontend is refetching updated post data

**Debug:**
```javascript
// Check MongoDB:
db.posts.findOne({_id: ObjectId("...")});
// Look at commentsCount vs comments array length
```

### Issue: CORS errors

**Check:**
1. Backend CORS config in server.js
2. CLIENT_ORIGIN env variable matches frontend URL
3. Frontend API_BASE_URL is correct

**Fix:**
```javascript
// server.js should have:
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: false
}));
```

### Issue: Validation errors

**Check:**
1. Request body matches schema (caption 1-2000 chars)
2. URL params are valid MongoDB IDs
3. Query params are integers (skip, limit)

**Debug:**
Look for 400 error response with message in Postman

---

## Performance Optimization TODOs

From 25% TODO items, prioritize these for next phase:

1. **Feed Optimization** (High Priority)
   - Implement infinite scrolling (replace "Load More" button)
   - Add skeleton loading states
   - Implement feed caching with React Query or similar
   - Add pagination cursor-based instead of offset

2. **Database Optimization** (High Priority)
   - Monitor indexes with MongoDB profiler
   - Consider comment aggregation for large post threads
   - Implement soft-delete batch cleanup jobs
   - Add Redis caching for hot posts

3. **Image Support** (Medium Priority)
   - Implement image upload to S3/Cloudinary
   - Add image preview in post form
   - Optimize image display with CDN

4. **Real-time Features** (Medium Priority)
   - Add Socket.io for live post/comment updates
   - Implement real-time like count updates
   - Add typing indicators for comments

5. **Search** (Medium Priority)
   - Implement text search for posts
   - Add MongoDB Atlas Search or Elasticsearch
   - Create dedicated search page/component

---

## Architecture Decisions

### Likes Storage
**Decision:** Array-based in Post document instead of separate collection

**Why:**
- Phase 2 scale: <10k users, manageable with array
- Simpler queries: Check like with `post.likes.find()`
- Better performance: Single document update

**Phase 3:** Consider separate Likes collection if:
- >100k posts with >1000 likes each
- Need detailed like analytics
- Implement like notifications

### Denormalized Counts
**Decision:** Store `likesCount` and `commentsCount` on post

**Why:**
- Fast feed rendering without counting
- Avoid N+1 queries
- Consistent with social media patterns

**Tradeoff:** Must keep count in sync when adding/removing

### Soft Deletes
**Decision:** Use `isDeleted` flag instead of permanent deletion

**Why:**
- Preserve data for analytics
- Support potential undelete feature
- Easier GDPR compliance
- Historical integrity

### Flat Comment Structure
**Decision:** Phase 2 uses flat comments, not nested threads

**Why:**
- Simpler implementation and queries
- Easier pagination
- Good for small communities

**Phase 3+:** Add nested replies with:
- `parentCommentId` field
- Threaded UI components
- Comment depth limiting

---

## What's 75% Complete

### Implemented ✅
- Full CRUD for posts
- Like/unlike system
- Comment creation and viewing
- Report submission
- User recommendations sidebar (mock data)
- Feed rendering
- All API endpoints
- All React components
- Validation and error handling
- Database models and indexes
- Authentication integration

### 25% TODO ⏳

**Backend TODOs:**
- Admin report review/moderation dashboard
- Comment liking system
- Advanced sorting/filtering
- Search implementation
- Real-time updates (WebSocket)
- Image upload handling
- Notification system
- Analytics tracking

**Frontend TODOs:**
- Image upload UI
- Infinite scrolling
- Loading skeletons
- Toast notifications
- Search UI
- User profile pages
- Follow system UI
- Advanced animations
- Mobile responsiveness improvements
- Accessibility (ARIA labels, keyboard nav)
- Error boundaries
- Dark mode refinement

**Database TODOs:**
- Search indexes
- View aggregations
- Backup strategies
- Replica sets for high availability
- Sharding strategy for scale

**DevOps TODOs:**
- Production deployment
- Monitoring and alerts
- Rate limiting
- DDoS protection
- CDN setup for static files

---

## Quick Reference: Component Hierarchy

```
App
└── AuthProvider
    └── Navbar
    ├── HomePage
    ├── LoginPage
    ├── SignupPage
    ├── DashboardPage (UPDATED FOR PHASE 2)
    │   ├── CreatePostForm (NEW)
    │   │   └── Form input/submission
    │   ├── Feed (NEW)
    │   │   └── PostCard (NEW) [repeated]
    │   │       ├── LikeButton (NEW)
    │   │       ├── CommentSection (NEW)
    │   │       │   ├── Comment input form
    │   │       │   └── Comment list
    │   │       └── ReportButton (NEW)
    │   └── UserRecommendations (NEW)
    │       └── Recommendation cards
    └── [other pages]
```

---

## Next Steps (Phase 3 Roadmap)

1. **User Profiles**
   - User detail pages
   - Profile editing
   - User statistics

2. **Following System**
   - Follow/unfollow users
   - Following feed
   - Follower list

3. **Recipe System**
   - Recipe creation
   - Recipe ratings
   - Saved recipes

4. **Notifications**
   - Real-time notifications
   - Email notifications
   - Notification center

5. **Admin Dashboard**
   - Moderation tools
   - Report management
   - User analytics
   - Content statistics

---

## Troubleshooting Checklist

- [ ] MongoDB is running and MONGO_URI is correct
- [ ] Server is running on port 5000
- [ ] Client is running on port 5173
- [ ] You're logged in (token in localStorage)
- [ ] Network tab shows POST/GET requests succeeding
- [ ] Browser console has no errors
- [ ] PostCard component renders without errors
- [ ] Feed component calls loadPosts() on mount
- [ ] API responses have expected data structure
- [ ] Like button is disabled while request pending

---

For more details on specific components or API endpoints, check the comments in the source files.
