const knex = require("./db/knex");
const routes = require("express").Router();

routes.get("/", async (req, res) => {
  const projects = await knex.select().from("projects");

  if (!projects) res.statusCode(500);
  res.json({ data: projects });
});

module.exports = routes;
