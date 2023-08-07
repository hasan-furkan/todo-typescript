const express = require('express');
const Todo = require('../../models').Todo;
const router = express.Router();

const { tokenValidatorMiddleware } = require('../../functions/auth');

router.get('/', tokenValidatorMiddleware, (req, res) => {
    Todo.findAll({ where: { UserId: req.userObj.id, isDeleted: false } }).then((todos) => {
        return res.status(200).send({ status: true, message: 'todos found', data: todos });

    }).catch((error) => {
        console.error("Error: ", error);
        return res.status(500).send({ status: false, message: 'Internal Server Error' });
    });
})

router.post('/', tokenValidatorMiddleware, async (req, res) => {
    try {
        const todo = await Todo.create({
            title: req.body.title,
            completed: req.body.completed,
            UserId: req.userObj.id
        });

        return res.status(200).send({ status: true, message: 'todo added', data: todo });
    } catch (e) {
        console.log("error: ", e);
    }

});


router.put('/:id', tokenValidatorMiddleware, (req, res) => {
   const id = req.params.id;
    Todo.update({
        title: req.body.title,
        completed: req.body.completed
    }, {
        where: {
            id: id,
            UserId: req.userObj.id
        }
    })
    .then((todo) => {
        return res.status(200).send({ status: true, message: 'todo updated', data: todo });
    }).catch((error) => {
        console.error("Error: ", error);
        return res.status(500).send({ status: false, message: 'Internal Server Error' });
    });
});


router.delete('/:id', tokenValidatorMiddleware, (req, res) => {
    const id = req.params.id;
    Todo.update({
        isDeleted: true
    }, {
        where: {
            id: id,
            UserId: req.userObj.id
        }
    })
    .then((todo) => {
        return res.status(200).send({ status: true, message: 'todo deleted', data: todo });
    }).catch((error) => {
        console.error("Error: ", error);
        return res.status(500).send({ status: false, message: 'Internal Server Error' });
    });
});

module.exports = router;
