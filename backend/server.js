require("dotenv").config();
const express = require('express');
const app = express();
const httpLogger = require('morgan');
const cors = require('cors');
const port = 3000;
const { db } = require("./firebase");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use(httpLogger('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

async function checkDbConnection() {
  try {
    const snapshot = await db.collection("products").limit(1).get();
    console.log(` Firestore connected!`);
  } catch (err) {
    console.error(" Firestore connection failed:", err.message);
  }
}

checkDbConnection();

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
