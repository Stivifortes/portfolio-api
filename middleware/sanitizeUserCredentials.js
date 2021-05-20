module.exports = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and Password are required!",
      code: "CREDENTIALS_REQUIRED",
    });
  }
  next();
};
