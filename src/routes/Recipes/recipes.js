const { Router } = require("express");
const router = Router();
const { getApiDbRecipe, postRecipe, getRecipesById } = require("./store");

//  GET
//       -->/recipes?name="..." ->Listado de nombre de Recipes
//       -->/recipes            ->Lisado de todas las Recipes
router.get("/", async (req, res, next) => {
  let name = req.query.name;

  try {
    let totalRecipes = await getApiDbRecipe();

    if (name) {
      //Si hay nombre-->
      let recipesName = await totalRecipes.filter((element) =>
        element.name.toLowerCase().includes(name.toLowerCase())
      );
      recipesName.length
        ? res.status(200).send(recipesName)
        : res.status(404).send("La receta no existe");
    } else {
      //Envia todas las recetas
      res.status(200).send(totalRecipes);
    }
  } catch (error) {
    throw new Error(error);
  }
});

//  GET
//      --> recipes/{idReceta}:
//          Obtener el detalle de una receta en particular
//          Debe traer solo los datos pedidos en la ruta de detalle de receta
//          ok--> imagen
//          ok--> nombre
//          ok--> tipo de plato
//          ok--> tipo de dieta
//          ok--> Resumen del plato
//          ok--> Puntuación ok
//          ok--> Nivel de "comida saludable"
//          ok--> Paso a paso

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (id) {
      const idMatch = await getRecipesById(id);

      if (idMatch === "Recipe id is not found") {
        res.status(404).send("Recipe id is not found");
      } else {
        res.status(200).json(idMatch);
      }
    }
  } catch (error) {
    throw new Error(error);
  }
});

// POST
//      -->/recipes  Recibe los datos recolectados desde el formulario controlado de la ruta de creación de recetas por body
//                    Crea una receta en la base de datos
//                     ok-> Nombre
//                     ok-> Resumen del plato
//                     ok-> Puntuación
//                     ok-> Nivel de "comida saludable"
//                     ok-> Paso a paso
//                     ok-> Posibilidad de seleccionar/agregar uno o más tipos de dietas

router.post("/", async (req, res) => {
  if (!req.body.name || !req.body.summary) {
    res.status(404).send("Name and Summary are required");
  }

  try {
    let recipe = await postRecipe(req.body);
    res.status(200).send(recipe);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;
