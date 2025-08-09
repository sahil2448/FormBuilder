const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute.js");
const formRoutes = require("./Routes/formRoutes.js");
const questionRoutes = require("./Routes/questionRoutes.js");
const responseRoutes = require("./Routes/responseRoutes.js");
const uploadRoutes = require("./Routes/uploadRoutes.js");
const { MONGO_URL, PORT } = process.env;

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

app.use(express.json());

app.use("/", authRoute);
// app.use("/auth", authRoutes);
app.use("/forms", formRoutes);
app.use("/questions", questionRoutes);
app.use("/responses", responseRoutes);
app.use("/upload", uploadRoutes);
