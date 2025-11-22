

 exports.getProfile = (req, res) => {
  res.status(200).json({
    message: 'Welcome to profile',
    userId: req.user.userId, // decoded from JWT
  });
};
