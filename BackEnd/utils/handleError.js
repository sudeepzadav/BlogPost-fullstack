const handleError = (res, error) => {
  return res.status(500).json({
    success: false,
    message: "Server Error",
    error: error.message,
  });
};
module.exports = handleError;