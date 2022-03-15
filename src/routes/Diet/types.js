const { Router } = require("express");
const router = Router();
const { preload } = require("./store");

//  GET
//      --> recipes/types:
//          Obtener todos los tipos de dieta posibles
//          En una primera instancia, cuando no exista ninguno,
//          deberán precargar la base de datos con los tipos de datos indicados por spoonacular

router.get("/", async (req, res) => {
  try {
    const types = await preload();
    res.status(200).send(types);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;
