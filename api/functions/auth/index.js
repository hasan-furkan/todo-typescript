const jwt = require('jsonwebtoken');
const config = require('../../config');

const tokenGeneratorMiddleware = (userObj) => {
    if (typeof userObj === "string") {
        userObj = JSON.parse(userObj);
    }

    if (userObj && userObj.id) {
        return jwt.sign({ id: userObj.id }, config.secret, { expiresIn: config.jwt.expiresIn });
    } else {
        throw new Error('Invalid user object for token generation');
    }
}

const tokenValidatorMiddleware = (req, res, next) => {
    if (req && req.headers && req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            req.userObj = jwt.verify(token, config.secret);
            next();
        } catch (error) {
            console.error("JWT Error:", error.message);
            res.status(401).send({ status: false, message: 'Unauthorized' });
        }
    } else {
        res.status(401).send({ status: false, message: 'Unauthorized' });
    }
}

module.exports = {
    tokenGeneratorMiddleware,
    tokenValidatorMiddleware
}
