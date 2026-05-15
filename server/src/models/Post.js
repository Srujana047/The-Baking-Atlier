import mongoose from "mongoose";

/**
 * Casual baking post schema.
 * Stores user-generated casual baking posts with text, optional images, and engagement metrics.
 * 
 * Phase 2: Basic post structure with likes and comments references.
 * Phase 3+: Image storage, advanced metadata, recipe linking, etc.
 */
const postSchema = new mongoose.Schema(
  {
    // Author reference
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    authorName: {
      type: String,
      required: true
    },

    // Post content
    caption: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 2000,
      description: "Post text/caption"
    },

    // TODO: implement image upload system (Phase 3)
    // imageUrl: String,
    // imageAlt: String,

    // Engagement metrics (denormalized for performance)
    likesCount: {
      type: Number,
      default: 0,
      min: 0
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0
    },

    // TODO: add shares/reblogs count later
    // sharesCount: Number,

    // Likes tracking - array of user IDs who liked this post
    // TODO: consider using separate Likes collection for scalability at high volume
    likes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        }
      }
    ],

    // Comments references - populated when needed
    // TODO: implement comment fetching optimization
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ],

    // Content status
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }

    // TODO: add tags field for future categorization
    // TODO: add location field for community events
    // TODO: add hashtags for discoverability
  },
  { timestamps: true, index: { createdAt: -1 } }
);

// Index for finding posts by author
postSchema.index({ authorId: 1, createdAt: -1 });

export const Post = mongoose.model("Post", postSchema);
