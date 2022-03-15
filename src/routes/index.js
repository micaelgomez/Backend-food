const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const typesRoute = require("../routes/Diet/types");
const recipesRoute = require("../routes/Recipes/recipes");

const router = Router();
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use("/types", typesRoute);
router.use("/recipes", recipesRoute);

module.exports = router;
