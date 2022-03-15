const { Diet } = require("../../db");

//--> Dietas para precargar
const diets = [
  "gluten free",
  "dairy free",
  "paleolithic",
  "ketogenic",
  "lacto ovo vegetarian",
  "vegan",
  "pescatarian",
  "primal",
  "fodmap friendly",
  "whole 30",
];

//--> Funcion pre-cargadora
async function preload() {
  const mapDiets = diets.forEach(async (element) => {
    await  newDiet.findOrCreate({
      where: { name: element },
    });
  });

  const allDiets = await Diet.findAll();
  return allDiets;
}

module.exports = {
  preload,
};
