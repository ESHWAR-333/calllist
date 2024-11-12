const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./models");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());

// Connect to SQLite
sequelize.sync().then(() => {
  console.log("SQLite connected");
});

// Routes
app.use("/api", apiRoutes);

app.listen(8001, () => {
  console.log("Server running on port http://localhost:8001 ");
});
