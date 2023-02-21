const app = require("./app");
const connectDatabase = require("./config/Database");

const dotenv = require("dotenv");

//config
dotenv.config({ path: "config/config.env" });

//connecting to database
connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(`server started on port ${process.env.PORT}`);
});
