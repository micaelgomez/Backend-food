const { API_KEY, API_KEY_2, API_KEY_3 } = process.env;
const { Diet, Recipe } = require("../../db");
const axios = require("axios").default;

//-->BUSCA todas las recetas de la api
async function getApiRecipe() {
  try {
    const apyRecipe = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&&addRecipeInformation=true&number=30`
    );
    const apyRecipe1 = await apyRecipe.data.results.map((element) => {
      return {
        vegetarian: element.vegetarian,
        vegan: element.vegan,
        glutenFree: element.glutenFree,
        score: element.spoonacularScore,
        health: element.healthScore,
        id: element.id,
        name: element.title,
        image: element.image,
        summary: element.summary,
        dishTypes: element.dishTypes,
        diets: element.diets,
        steps: element.analyzedInstructions
          ? element.analyzedInstructions[0]
          : null,
      };
    });

    return apyRecipe1;
  } catch (error) {
    next(error);
  }
}
//-->BUSCA Todas las recetas de la db
async function getDbRecipe() {
  try {
    return await Recipe.findAll({
      include: {
        model: Diet,
      },
    });
    // console.log(json);
  } catch (error) {
    next(error);
  }
}
// -->CONCATENO en un array infotal = [getApiRecipe,getDbrecipe]
async function getApiDbRecipe() {
  try {
    let apiInfo = await getApiRecipe();
    let dbInfo = await getDbRecipe();

    let totalInfo = apiInfo.concat(dbInfo);

    return totalInfo;
  } catch (error) {
    next(error);
  }
}

//--> BUSCA POR ID
async function getRecipesById(id) {
  try {
    if (id.length === 36) {
      //Busco el match en dataBase
      const dbMatch = await Recipe.findOne({
        where: {
          id: id,
        },
        include: {
          model: Diet,
        },
      });
      if (dbMatch !== null) return dbMatch;
      else {
        return "id Recipe not found";
      }
    } else {
      //Busco el match en la api
      const apiMatch = await axios.get(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
      );
      let apiMatch1 = await apiMatch.data;
      apiMatch1 = [apiMatch1];

      // console.log(apiMatch1);
      //-->Info que necesito
      const apiMatch2 = await apiMatch1.map((element) => {
        return {
          vegetarian: element.vegetarian,
          vegan: element.vegan,
          glutenFree: element.glutenFree,
          score: element.spoonacularScore,
          health: element.healthScore,
          id: element.id,
          name: element.title,
          image: element.image,
          summary: element.summary,
          dishTypes: element.dishTypes,
          diets: element.diets,

          steps: element.analyzedInstructions
            ? element.analyzedInstructions[0]
            : null,
        };
      });

      // console.log(apiMatch2);

      return apiMatch2;
    }
  } catch (error) {
    throw new Error(error);
  }
}

//-->CREA NUEVA receta en la base de datos
async function postRecipe({
  name,
  summary,
  score,
  health,
  steps,
  dietName,
  dietString,
}) {
  if (!score) score = 1;
  if (!health) health = 1;

  try {
    //Crea nueva receta en base de datos
    const recipe = await Recipe.create({
      name,
      summary,
      score,
      health,
      steps,
      dietName,
      dietString,
    });

    if (dietName) {
      let arrayDiet = await Diet.findAll({
        where: { name: dietName },
      });
      recipe.addDiet(arrayDiet);
    }

    return "Recipe loaded!";
  } catch ({ message: error }) {
    throw new Error(error);
  }
}

module.exports = {
  getApiDbRecipe,
  postRecipe,
  getRecipesById,
};
