const express = require('express');
const router = express.Router();
const redisClient = require('../../redisClient');

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
    } catch (error) {
        console.error('Redis Error:', error.message);
        return res.status(500).send({ status: false, message: 'Internal Server Error' });
    }

    return res.status(200).send({
        status: true,
        message: 'success',
        data: {email: user.email, token: token, refreshToken: refreshToken}
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
