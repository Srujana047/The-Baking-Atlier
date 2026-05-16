/**
 * Validation rules for recipes.
 * Used in route handlers with validateRequest middleware.
 */

export const recipeValidators = {
  // Validation for creating a new recipe
  createRecipe: {
    body: {
      title: {
        trim: true,
        notEmpty: {
          errorMessage: "Recipe title is required"
        },
        isString: {
          errorMessage: "Title must be a string"
        },
        isLength: {
          options: { min: 3, max: 150 },
          errorMessage: "Title must be between 3 and 150 characters"
        }
      },

      description: {
        trim: true,
        notEmpty: {
          errorMessage: "Description is required"
        },
        isString: {
          errorMessage: "Description must be a string"
        },
        isLength: {
          options: { min: 10, max: 1000 },
          errorMessage: "Description must be between 10 and 1000 characters"
        }
      },

      ingredients: {
        notEmpty: {
          errorMessage: "Ingredients list is required"
        },
        isArray: {
          errorMessage: "Ingredients must be an array"
        }
      },

      "ingredients.*.item": {
        trim: true,
        notEmpty: {
          errorMessage: "Each ingredient item is required"
        },
        isString: {
          errorMessage: "Ingredient item must be a string"
        },
        isLength: {
          options: { min: 2, max: 200 },
          errorMessage: "Ingredient item must be between 2 and 200 characters"
        }
      },

      "ingredients.*.quantity": {
        trim: true,
        notEmpty: {
          errorMessage: "Each ingredient quantity is required"
        },
        isString: {
          errorMessage: "Ingredient quantity must be a string"
        },
        isLength: {
          options: { min: 1, max: 50 },
          errorMessage: "Ingredient quantity must be between 1 and 50 characters"
        }
      },

      preparationSteps: {
        notEmpty: {
          errorMessage: "Preparation steps are required"
        },
        isArray: {
          errorMessage: "Preparation steps must be an array"
        }
      },

      "preparationSteps.*.description": {
        trim: true,
        notEmpty: {
          errorMessage: "Each step description is required"
        },
        isString: {
          errorMessage: "Step description must be a string"
        },
        isLength: {
          options: { min: 5, max: 500 },
          errorMessage: "Step description must be between 5 and 500 characters"
        }
      },

      category: {
        trim: true,
        notEmpty: {
          errorMessage: "Recipe category is required"
        },
        isIn: {
          options: [[
            "Cakes",
            "Cookies",
            "Bread",
            "Pastries",
            "Desserts",
            "Pies",
            "Muffins",
            "Brownies",
            "Other"
          ]],
          errorMessage: "Invalid recipe category"
        }
      },

      difficulty: {
        trim: true,
        optional: true,
        isIn: {
          options: [["Beginner", "Intermediate", "Advanced"]],
          errorMessage: "Difficulty must be Beginner, Intermediate, or Advanced"
        }
      },

      bakingTime: {
        notEmpty: {
          errorMessage: "Baking time is required"
        },
        toInt: true,
        isInt: {
          options: { min: 1, max: 480 },
          errorMessage: "Baking time must be between 1 and 480 minutes"
        }
      },

      tips: {
        trim: true,
        optional: true,
        isString: {
          errorMessage: "Tips must be a string"
        },
        isLength: {
          options: { max: 500 },
          errorMessage: "Tips must not exceed 500 characters"
        }
      }

      // TODO: add image URL validation when image upload is implemented
    }
  },

  // Validation for updating a recipe
  updateRecipe: {
    body: {
      title: {
        trim: true,
        optional: true,
        isString: {
          errorMessage: "Title must be a string"
        },
        isLength: {
          options: { min: 3, max: 150 },
          errorMessage: "Title must be between 3 and 150 characters"
        }
      },

      description: {
        trim: true,
        optional: true,
        isString: {
          errorMessage: "Description must be a string"
        },
        isLength: {
          options: { min: 10, max: 1000 },
          errorMessage: "Description must be between 10 and 1000 characters"
        }
      },

      ingredients: {
        optional: true,
        isArray: {
          errorMessage: "Ingredients must be an array"
        }
      },

      preparationSteps: {
        optional: true,
        isArray: {
          errorMessage: "Preparation steps must be an array"
        }
      },

      category: {
        trim: true,
        optional: true,
        isIn: {
          options: [[
            "Cakes",
            "Cookies",
            "Bread",
            "Pastries",
            "Desserts",
            "Pies",
            "Muffins",
            "Brownies",
            "Other"
          ]],
          errorMessage: "Invalid recipe category"
        }
      },

      difficulty: {
        trim: true,
        optional: true,
        isIn: {
          options: [["Beginner", "Intermediate", "Advanced"]],
          errorMessage: "Difficulty must be Beginner, Intermediate, or Advanced"
        }
      },

      bakingTime: {
        optional: true,
        toInt: true,
        isInt: {
          options: { min: 1, max: 480 },
          errorMessage: "Baking time must be between 1 and 480 minutes"
        }
      },

      tips: {
        trim: true,
        optional: true,
        isString: {
          errorMessage: "Tips must be a string"
        },
        isLength: {
          options: { max: 500 },
          errorMessage: "Tips must not exceed 500 characters"
        }
      }
    }
  },

  // Validation for fetching recipes with pagination
  getRecipes: {
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
      },

      category: {
        optional: true,
        trim: true,
        isIn: {
          options: [[
            "Cakes",
            "Cookies",
            "Bread",
            "Pastries",
            "Desserts",
            "Pies",
            "Muffins",
            "Brownies",
            "Other"
          ]],
          errorMessage: "Invalid recipe category"
        }
      },

      difficulty: {
        optional: true,
        trim: true,
        isIn: {
          options: [["Beginner", "Intermediate", "Advanced"]],
          errorMessage: "Invalid difficulty level"
        }
      },

      search: {
        optional: true,
        trim: true,
        isString: {
          errorMessage: "Search must be a string"
        },
        isLength: {
          options: { min: 1, max: 100 },
          errorMessage: "Search must be between 1 and 100 characters"
        }
      }

      // TODO: add minBakingTime and maxBakingTime filters
    }
  },

  // Validation for recipe ID parameter
  recipeId: {
    params: {
      recipeId: {
        isMongoId: {
          errorMessage: "Invalid recipe ID format"
        }
      }
    }
  }
};
