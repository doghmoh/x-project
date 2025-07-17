const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const errorHandler = require("./middleware/errorHandler");
const myrouter = require("./routes/v1");
const { apiKeyAuth } = require("./middleware/apiKeyAuth");
const { createDefaultAdmin } = require("./controllers/authController");

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // allow frontend origin
    credentials: true, // if using cookies or auth headers
  })
);

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
  .then(async () => {
    console.log("✅ MongoDB connected");
    await createDefaultAdmin();

    app.listen(process.env.PORT || 3000, () =>
      console.log(`🚀 Server on http://localhost:${process.env.PORT || 3000}`)
    );
  })
  .catch((err) => console.error("Mongo Error", err));
