const express = require('express');
const Todo = require('../../models').Todo;
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World! todo pagess')
})

router.post('/', async (req, res) => {
    try {
        const todo = await Todo.create({
            title: req.body.title,
            completed: req.body.completed,
            UserId: req.body.UserId
        });

        return res.status(200).send({ status: true, message: 'todo added', data: todo });
    } catch (e) {
        console.log("error: ", e);
    }

});



module.exports = router;
