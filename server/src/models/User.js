import mongoose from "mongoose";

// Phase 1-3: scalable user schema.
// Tracks user contributions and engagement metrics
// Later phases can add profile fields (avatar, bio, favorites, badges, etc).
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    // Phase 3: User contribution tracking
    postsCount: {
      type: Number,
      default: 0,
      min: 0,
      description: "Total number of casual posts created"
    },

    recipesCount: {
      type: Number,
      default: 0,
      min: 0,
      description: "Total number of recipes created"
    },

    // TODO: Phase 4 - add user profile fields
    // profileImageUrl: String,
    // bio: String,
    // location: String,
    // bakingLevel: {enum: ['Beginner', 'Intermediate', 'Advanced']},
    // website: String,
    // followers: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    // following: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],

    // TODO: Phase 4 - add achievements/badges
    // badges: [String],
    // totalLikes: Number,

    // TODO: Phase 4 - add user preferences
    // favoriteCategories: [String],
    // newsletter: {type: Boolean, default: true},
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

