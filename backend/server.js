// server.js
const express = require('express');
const app = express();
const httpLogger = require('morgan');
const cors = require('cors');
const port = 3000;
const { db } = require("./firebase");

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use(httpLogger('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// DB connectivity check
async function checkDbConnection() {
  try {
    const snapshot = await db.collection("products").limit(1).get();
    console.log(`✅ Firestore connected! Found ${snapshot.size} products.`);
  } catch (err) {
    console.error("❌ Firestore connection failed:", err.message);
  }
}

checkDbConnection();

// Use routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
