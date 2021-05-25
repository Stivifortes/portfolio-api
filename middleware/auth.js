const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  //const token = req.headers.bearer.split('"')[1];

  if (!token) return res.status(401).json({ message: "User not authorized" });

  const { id, username } = jwt.verify(token, process.env.TOKEN_SECRET);
  req.userId = id;
  req.username = username;
  next();
};
