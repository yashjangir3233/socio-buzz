const express = require("express");

const app = express();

app.use(express.json());

const userRoute = require("./routes/userRoutes");
const postRoute = require("./routes/postRoutes");

app.use(userRoute);
app.use(postRoute);

module.exports = app;
