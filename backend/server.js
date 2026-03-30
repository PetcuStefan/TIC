// backend/server.js
require("dotenv").config();
const express = require('express');
const httpLogger = require('morgan');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const fileUpload = require("express-fileupload");

const { db } = require("./firebase"); // Correct destructuring

// Import routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(httpLogger('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Serve uploads folder as static
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Test Firestore connection
async function checkDbConnection() {
  try {
    const snapshot = await db.collection("products").limit(1).get();
    console.log(`✅ Firestore connected!`);
  } catch (err) {
    console.error("❌ Firestore connection failed:", err.message);
  }
}

checkDbConnection();

// Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/", uploadRoutes);
app.use("/payment", paymentRoutes);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});