
const tokenBasedMiddleware = (req, res, next) => {
console.log(req.header('Authorization'))
next();
}

export default tokenBasedMiddleware;