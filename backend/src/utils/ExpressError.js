class ExpressError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

const wrapAsync = (func) => {
  return function (req, res, next) {
    func(req, res, next).catch((error) => next(error));
  };
};

export default ExpressError;
export { wrapAsync };
