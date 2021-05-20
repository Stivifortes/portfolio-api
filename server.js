require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const knex = require("./db/knex");
const jwt = require("jsonwebtoken");
const sanitizeProject = require("./middleware/sanitizeProject");
const sanitizeUserCredentials = require("./middleware/sanitizeUserCredentials");
const auth = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

//Get All projects
app.get("/projects", async (req, res) => {
  try {
    const projects = await knex.select().from("projects");
    res.json({ data: projects });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Create a project
app.post("/project", auth, sanitizeProject, async (req, res) => {
  //Pegar o id atravez de token

  try {
    const userid = req.userId;
    const { project, description, repository, image_url } = req.body;
    const id = await knex("projects").insert(
      {
        name: project,
        description,
        repository,
        image_url,
        id_user_fk: userid,
      },
      ["id"]
    );
    res.json({
      message: "project successfully inserted!",
      data: { id, project, description, repository, image_url, id_user },
    });
  } catch (error) {
    res.status(500).json({ message: "Couldnt insert project" });
  }
});

//Login
app.post("/login", sanitizeUserCredentials, async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await knex.first().from("users").where({ username });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Username or password incorrect", code: "BAD_LOGIN" });
    }

    //Hash and compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        { id: user.id, username },
        process.env.TOKEN_SECRET
      );
      return res.json({ message: "Login successful", token });
    }

    return res
      .status(400)
      .json({ message: "Username or password incorrect", code: "BAD_LOGIN" });
  } catch (error) {
    return res.sendStatus(500);
  }
});

//Sign
app.post("/signin", sanitizeUserCredentials, async (req, res) => {
  try {
    const { username, password } = req.body;
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const id = await knex("users").insert({
      username,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: id[0], username }, process.env.TOKEN_SECRET);

    return res.json({ token, message: "User signed in successful" });
  } catch (error) {
    return res.sendStatus(500);
  }
});
//Delete a project
app.delete("/project", async (req, res) => {});

//Update a project
app.put("/project/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  res.json({ id: id, data: data });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
