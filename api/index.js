const express = require('express');
const app = express();
const cors = require('cors');
const config = require('./config');
const todoRouter = require('./routes/todo');
const { Sequelize } = require('sequelize');
const { sequelize } = require('./models');

app.use(express.json());
app.use(cors());

app.use('/api/v1.0/todos', todoRouter);

const connectDb = new Sequelize('postgres', config.db.user, config.db.password, {
    host: config.db.host,
    dialect: 'postgres',
    port: config.db.port,
    username: config.db.user,
    password: config.db.password,
    database: config.db.database
});

try {
    if (connectDb) {
        sequelize.sync().then(() => {
            console.log("Database synced");
            return connectDb.authenticate();
        }).then(() => {
            console.log(`Connected to ${config.db.database} database`);
        });
    } else {
        console.log(`Failed to connect to ${config.db.database} database`);
    }
} catch (err) {
    console.log("Error: ", err);
}


const port = config.port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
