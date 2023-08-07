const express = require('express');
const router = express.Router();

const { tokenGeneratorMiddleware } = require('../../functions/auth');

const User = require('../../models').User;

router.post('/login', async (req, res) => {
    const { email, password } = await req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(400).send({ status: false, message: 'User not found' });
    }

    const token = tokenGeneratorMiddleware(user);

    return res.status(200).send({ status: true, message: 'User found', data: user, token: token });
});


module.exports = router;
