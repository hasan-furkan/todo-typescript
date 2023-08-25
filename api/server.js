const express = require("express");
const app = express();
const cors = require("cors");
const config = require("./config");
const { Sequelize } = require("sequelize");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const es = require("./es");

const { sequelize } = require("./models");
const { startRedis } = require("./redisClient");
const { everyMinutes, everyFiveMinutes } = require("./cron");
const todoRouter = require("./routes/todo");
const authRouter = require("./routes/auth");

app.use(express.json());
app.use(cors());

app.use("/api/v1.0/todos", todoRouter);
app.use("/api/v1.0/auth", authRouter);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const connectDb = new Sequelize(
  "postgres",
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: "postgres",
    port: config.db.port,
    username: config.db.user,
    password: config.db.password,
    database: config.db.database,
    logging: false,
  }
);

try {
  if (connectDb) {
    sequelize
      .sync()
      .then(() => {
        console.log("Database synced", new Date());
        return connectDb.authenticate();
      })
      .then(() => {
          // connected to database
        console.log(`Connected to ${config.db.database} database`, new Date());

        // connected to redis
        startRedis();

        // connected to elasticsearch
        es.ping({}, function (error) {
            if (error) {
                console.log("Elasticsearch cluster is down!");
            }
        }).then(r => {
            console.log("Elasticsearch cluster is up!", new Date());
        } );

        // start cron job
        everyMinutes.start();
        everyFiveMinutes.start();
      });
  } else {
    console.log(`Failed to connect to ${config.db.database} database`);
  }
} catch (err) {
  console.log("Error: ", err);
}

module.exports = app;
