const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) return res.status(401).json({ message: "User not authorized" });

  const { id } = jwt.verify(token, process.env.TOKEN_SECRET);
  req.userId = id;
  next();
};
