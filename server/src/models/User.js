import mongoose from "mongoose";

// Phase 1: minimal but scalable user schema.
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
    }

    // TODO: add profileImageUrl, bio, location, bakingLevel, socials, etc.
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

