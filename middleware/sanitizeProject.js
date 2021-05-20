const sanitizeProject = (req, res, next) => {
  const { project, description, repository, image_url, id_user } = req.body;

  if (!project || !description || !repository || !image_url || !id_user) {
    return res.status(400).json({ message: "All the fileds are required!" });
  }
  next();
};

module.exports = sanitizeProject;
