class ExpressError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
const wrapAsync = (func)=> { return function(req, res, next){ func(req, res, next).catch(e=> next(e) )}}
export default ExpressError;
export { wrapAsync };