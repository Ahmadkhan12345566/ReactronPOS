import ExpressError  from "../utils/ExpressError.js";


const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new ExpressError("You are not authorized to do that", 401));
  }
  next();
};

export default isAdmin;

