const express = require('express');
const app = express();
const cors = require('cors');

const todoRouter = require('./routes/todo');

app.use(express.json());
app.use(cors());

app.use('/api/v1.0/todos', todoRouter);



const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
