const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const { authRoutes } = require("./routes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "8mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

// set public folder
app.use(express.static("public"));

// all app routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "welcome" });
});

// database connection
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("database connection successful!"))
  .catch((err) => console.log("error", err));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
