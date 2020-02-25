const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require("passport");
require("dotenv").config();

const cors = require("cors");
const shift = require("./routes/api/shift");
const period = require("./routes/api/period");
const users = require("./routes/api/users");
const employer = require("./routes/api/employer");

const app = express();

const PORT = process.env.PORT || 5000;

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

//DB config
const db = require("./config/keys").mongoURI;

//Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDb connected"))
  .catch(err => console.log(err));

//Passport middleware
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, "client", "build")));

//passport config
require("./config/passport")(passport);

app.use("/api/shift", shift);
app.use("/api/period", period);
app.use("/api/users", users);
app.use("/api/employer", employer);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
