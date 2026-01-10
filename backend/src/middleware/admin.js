import ExpressError from "../utils/ExpressError.js";

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(new ExpressError("You are not authorized to do that.", 403));
  }
  next();
};

export default isAdmin;

