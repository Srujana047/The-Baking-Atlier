/**
 * Validation rules for posts and comments.
 * Used in route handlers with validateRequest middleware.
 */

export const postValidators = {
  // Validation for creating a new post
  createPost: {
    body: {
      caption: {
        trim: true,
        notEmpty: {
          errorMessage: "Caption is required"
        },
        isString: {
          errorMessage: "Caption must be a string"
        },
        isLength: {
          options: { min: 1, max: 2000 },
          errorMessage: "Caption must be between 1 and 2000 characters"
        }
      }
      // TODO: add image URL validation when image upload is implemented
    }
  },

  // Validation for fetching posts with pagination
  getPosts: {
    query: {
      skip: {
        optional: true,
        toInt: true,
        isInt: { 
          options: { min: 0 },
          errorMessage: "Skip must be a non-negative integer"
        }
      },
      limit: {
        optional: true,
        toInt: true,
        isInt: { 
          options: { min: 1, max: 100 },
          errorMessage: "Limit must be between 1 and 100"
        }
      }
    }
  }
};

export const commentValidators = {
  // Validation for creating a comment
  createComment: {
    body: {
      text: {
        trim: true,
        notEmpty: {
          errorMessage: "Comment text is required"
        },
        isString: {
          errorMessage: "Comment must be a string"
        },
        isLength: {
          options: { min: 1, max: 500 },
          errorMessage: "Comment must be between 1 and 500 characters"
        }
      }
    },
    params: {
      postId: {
        isMongoId: {
          errorMessage: "Invalid post ID"
        }
      }
    }
  }
};

export const reportValidators = {
  // Validation for reporting content
  createReport: {
    body: {
      reportedType: {
        notEmpty: {
          errorMessage: "Content type is required"
        },
        isIn: {
          options: [["post", "comment"]],
          errorMessage: "Content type must be 'post' or 'comment'"
        }
      },
      reportedId: {
        notEmpty: {
          errorMessage: "Content ID is required"
        },
        isMongoId: {
          errorMessage: "Invalid content ID"
        }
      },
      reason: {
        notEmpty: {
          errorMessage: "Reason is required"
        },
        isIn: {
          options: [["inappropriate", "spam", "harassment", "offensive", "other"]],
          errorMessage: "Invalid reason"
        }
      }
    }
  }
};
