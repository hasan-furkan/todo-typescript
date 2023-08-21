const express = require('express');
const router = express.Router();
const redisClient = require('../../redisClient');
const es = require('../../es');

const {
    tokenGeneratorMiddleware,
    refreshTokenGeneratorMiddleware,
    extractUserIdFromRefreshToken
} = require('../../functions/auth');

const User = require('../../models').User;

router.post('/login', async (req, res) => {
    const {email, password} = await req.body;
    const user = await User.findOne({email: email});

    if (!user) {
        return res.status(404).send({status: false, message: 'User not found'});
    }
    const userId = user.id;
    const token = tokenGeneratorMiddleware(user);
    const refreshToken = refreshTokenGeneratorMiddleware(user);

    try {
        await redisClient.set(`refreshToken:${userId}`, refreshToken, 'EX', 86400);
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        await es.index({
            index: 'login-success',
            body: {
                userId: userId,
                email: email,
                timestamp: new Date(),
                userIpAdress: ip
            }
        })
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Internal Server Error' });
    }

    return res.status(200).send({
        status: true,
        message: 'success',
        id: user.id,
        data: {email: user.email, accessToken: token, refreshToken: refreshToken}
    });
});

router.post('/refresh-token', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).send({ status: false, message: 'No refresh token provided' });
        }

        const userId = extractUserIdFromRefreshToken(refreshToken);
        if (!userId) {
            return res.status(400).send({ status: false, message: 'Invalid token' });
        }

        const storedToken = await redisClient.get(`refreshToken:${userId}`);

        if (storedToken !== refreshToken) {
            return res.status(401).send({ status: false, message: 'Invalid refresh token' });
        }

        const user = await User.findByPk(userId);
        const newToken = tokenGeneratorMiddleware(user);
        const newRefreshToken = refreshTokenGeneratorMiddleware(user);
        await redisClient.set(`refreshToken:${userId}`, newRefreshToken, 'EX', 86400);
        res.status(200).send({ status: true,
            data: { accessToken : newToken,   refreshToken : newRefreshToken } });
    } catch (error) {
        next(error);
    }
});


module.exports = router;
