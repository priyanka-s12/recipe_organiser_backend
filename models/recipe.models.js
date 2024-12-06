const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: 'String',
    },
    image: {
      type: 'String',
    },
    cuisineType: {
      type: String,
      enum: ['Italian', 'Indian', 'Thai', 'Mexican', 'Chinese'],
    },
    ingredients: [
      {
        type: String,
      },
    ],
    instructions: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const RecipeData = mongoose.model('RecipeData', recipeSchema);
module.exports = RecipeData;
