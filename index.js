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

app.get('/', (req, res) => res.send('Hello, express'));

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
      res.status(404).json({ message: 'No recipe found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all recipes.' });
  }
});

//get recipe by id
async function getRecipeById(recipeId) {
  try {
    const recipe = await RecipeData.findOne({ _id: recipeId });
    return recipe;
  } catch (error) {
    console.log(error);
  }
}

app.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await getRecipeById(req.params.id);
    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ error: 'no recipe found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch a recipe' });
  }
});

//get recipe by name
async function getRecipeByName(recipeName) {
  try {
    const recipe = await RecipeData.findOne({ name: recipeName });
    return recipe;
  } catch (error) {
    console.log(error);
  }
}

app.get('/recipes/name/:recipename', async (req, res) => {
  try {
    const recipe = await getRecipeByName(req.params.recipename);
    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ error: 'recipe not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get a recipe' });
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

//update recipe by id
async function updateRecipe(recipeId, dataToUpdate) {
  try {
    const recipe = await RecipeData.findByIdAndUpdate(recipeId, dataToUpdate, {
      new: true,
    });
    return recipe;
  } catch (error) {
    console.log(error);
  }
}

app.post('/recipes/:id', async (req, res) => {
  try {
    const updatedRecipe = await updateRecipe(req.params.id, req.body);
    if (updatedRecipe) {
      res.status(200).json({
        message: 'Recipe updated successfully',
        recipe: updatedRecipe,
      });
    } else {
      res.status(404).json({ error: 'Recipe not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update a recipe' });
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
