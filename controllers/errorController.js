// controllers/errorController.js
exports.triggerIntentionalError = (req, res, next) => {
  try {
    throw new Error("Intentional server error for testing.");
  } catch (err) {
    err.status = 500;
    next(err);
  }
};
