const express = require('express');
const cors = require('cors');
const { initialiseDatabase } = require('./db/db.connect');
const RecipeData = require('./models/recipe.models');
// const fs = require('fs');
const PORT = 3000;

const app = express();

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

initialiseDatabase();
app.use(express.json());

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// const jsonData = fs.readFileSync('./recipes.json', 'UTF-8');
// const recipeData = JSON.parse(jsonData);
// function seedData() {
//   try {
//     for (const data of recipeData) {
//       const newData = new RecipeData({
//         name: data.name,
//         image: data.image,
//         cuisineType: data.cuisineType,
//         ingredients: data.ingredients,
//         instructions: data.instructions,
//       });
//       newData.save();
//     }
//   } catch (error) {
//     console.log('Error seeding the data', error);
//   }
// }

// seedData();

//get all recipes
async function getAllRecipes() {
  try {
    const allRecipes = await RecipeData.find();
    return allRecipes;
  } catch (error) {
    console.log(error);
  }
}

app.get('/recipes', async (req, res) => {
  try {
    const recipes = await getAllRecipes();
    if (recipes.length > 0) {
      res.json(recipes);
    } else {
      res.status(400).json({ message: 'No recipe found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all recipes.' });
  }
});

//add recipe
async function addRecipe(newRecipe) {
  try {
    const recipe = new RecipeData(newRecipe);
    const saveRecipe = await recipe.save();
    return saveRecipe;
  } catch (error) {
    console.log(error);
  }
}

app.post('/recipes', async (req, res) => {
  try {
    const savedRecipe = await addRecipe(req.body);
    res
      .status(201)
      .json({ message: 'Recipe added successfully', recipe: savedRecipe });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add recipe' });
  }
});

//delete by id
async function deleteRecipe(recipeId) {
  try {
    const deleteRecipe = await RecipeData.findByIdAndDelete(recipeId);
    return deleteRecipe;
  } catch (error) {
    console.log(error);
  }
}

app.delete('/recipes/:recipeId', async (req, res) => {
  try {
    const deletedRecipe = await deleteRecipe(req.params.recipeId);
    if (deletedRecipe) {
      res.status(200).json({ message: 'Recipe deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});
