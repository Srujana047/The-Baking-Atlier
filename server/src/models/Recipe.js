import mongoose from "mongoose";

/**
 * Recipe Schema
 * Stores professional baking recipes created by users
 * Separate from casual posts - represents detailed, structured baking recipes
 * 
 * Phase 3: Complete recipe structure with ingredients, steps, categories, and metadata
 * Phase 4+: Image uploads, nutrition info, recipe ratings, bookmarking, etc.
 */
const recipeSchema = new mongoose.Schema(
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

    // Basic recipe information
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
      description: "Recipe title"
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
      description: "Short description of the recipe"
    },

    // Recipe content - ingredients and steps
    ingredients: [
      {
        item: {
          type: String,
          required: true,
          trim: true,
          minlength: 2,
          maxlength: 200
        },
        quantity: {
          type: String,
          required: true,
          trim: true,
          minlength: 1,
          maxlength: 50
        }
      }
    ],

    preparationSteps: [
      {
        stepNumber: {
          type: Number,
          required: true
        },
        description: {
          type: String,
          required: true,
          trim: true,
          minlength: 5,
          maxlength: 500
        }
      }
    ],

    // Recipe metadata
    category: {
      type: String,
      enum: [
        "Cakes",
        "Cookies",
        "Bread",
        "Pastries",
        "Desserts",
        "Pies",
        "Muffins",
        "Brownies",
        "Other"
      ],
      required: true,
      description: "Recipe category/type"
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
      description: "Difficulty level of the recipe"
    },

    bakingTime: {
      type: Number,
      required: true,
      min: 1,
      max: 480,
      description: "Baking time in minutes"
    },

    // TODO: Phase 3 - add preparation time separately
    // preparationTime: Number,

    // Recipe images - currently placeholders
    // TODO: Phase 4 - implement real image upload system
    imageUrl: {
      type: String,
      default: null,
      description: "URL to recipe image (placeholder for now)"
    },

    // Optional fields
    tips: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
      description: "Optional baking tips and tricks"
    },

    // TODO: Phase 4 - add nutrition information
    // nutritionInfo: {
    //   calories: Number,
    //   protein: Number,
    //   carbs: Number,
    //   fat: Number
    // },

    // Engagement metrics (denormalized for performance)
    likesCount: {
      type: Number,
      default: 0,
      min: 0
    },

    // TODO: Phase 3+ - implement likes array for tracking
    likes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
      }
    ],

    commentsCount: {
      type: Number,
      default: 0,
      min: 0
    },

    // TODO: Phase 3+ - implement comments collection
    // comments: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Comment"
    //   }
    // ]

    // TODO: Phase 4 - add bookmarks count
    // bookmarksCount: Number,

    // TODO: Phase 4 - add rating system
    // averageRating: Number,
    // ratingsCount: Number,

    // Status and visibility
    isPublished: {
      type: Boolean,
      default: true,
      description: "Whether recipe is publicly visible"
    }

    // TODO: Phase 4 - add draft functionality
    // isDraft: Boolean,
  },
  { timestamps: true }
);

// Index for better query performance
recipeSchema.index({ authorId: 1, createdAt: -1 });
recipeSchema.index({ category: 1 });
recipeSchema.index({ title: "text", description: "text" }); // Text index for search

export const Recipe = mongoose.model("Recipe", recipeSchema);
