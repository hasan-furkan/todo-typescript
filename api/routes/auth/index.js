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

router.post('/refresh-token', async (req, res) => {
    const {refreshToken} = req.body;

    if (!refreshToken) {
        return res.status(400).send({status: false, message: 'No refresh token provided'});
    }

    const userId = extractUserIdFromRefreshToken(refreshToken); // Bu bir yardımcı fonksiyon olabilir.

    await redisClient.get(`refreshToken:${userId}`, async (err, storedToken) => {
        if (err) {
            throw err;
        }

        if (storedToken !== refreshToken) {
            return res.status(401).send({status: false, message: 'Invalid refresh token'});
        }

        const user = await User.findById(userId);
        const newToken = tokenGeneratorMiddleware(user);

        res.status(200).send({status: true, token: newToken});
    });
});


module.exports = router;
