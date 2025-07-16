const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const errorHandler = require("./middleware/errorHandler");
const myrouter = require("./routes/v1");
const { apiKeyAuth } = require("./middleware/apiKeyAuth");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

// Example route
app.get("/", (req, res) => res.send("API running..."));

// Routes
app.use("/api/v1", apiKeyAuth, myrouter);

// Error handler
app.use(errorHandler);

// Connect DB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server on http://localhost:${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("Mongo Error", err));
