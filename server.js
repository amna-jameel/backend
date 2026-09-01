const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.8.8"]);
require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = require("./src/app");
app.use(cookieParser());
const connectDB = require("./src/db/db");
connectDB();
app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});