const Operator = require("../models/Operator"); 
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const operator = await Operator.findOne({ username });

    if (!operator) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, operator.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    operator.password = undefined; // remove password from response
    const token = jwt.sign(
      { id: operator._id, username: operator.username },
      process.env.JWT_SECRET || "supersecret", // store this in .env
      { expiresIn: "7d" }
    );
    res.status(200).json({ message: "Login successful", operator, token });
  } catch (err) {
    next(err);
  }
};

exports.createDefaultAdmin = async () => {
  const existingAdmin = await Operator.findOne({ username: "admin" });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin", 10);
    await Operator.create({
      username: "admin",
      password: hashedPassword,
    });

    console.log("✅ Default admin created: username:admin / password:admin");
  } else {
    console.log("ℹ️ Admin already exists");
  }
};

exports.updatePassword = async (req, res, next) => {
  const { username, oldPassword, newPassword } = req.body;

  try {
    const operator = await Operator.findOne({ username });

    if (!operator) {
      return res.status(404).json({ message: "Operator not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      operator.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    operator.password = hashedPassword;
    await operator.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};
