//server app
const express = require('express');
const app = express();
const httpLogger = require('morgan');
const cors = require('cors');
const port = 3000;
const { db } = require("./firebase");

app.use(httpLogger('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// DB connectivity check
async function checkDbConnection() {
  try {
    // Try fetching one doc from "products" collection
    const snapshot = await db.collection("products").limit(1).get();
    console.log(`✅ Firestore connected! Found ${snapshot.size} products.`);
  } catch (err) {
    console.error("❌ Firestore connection failed:", err.message);
  }
}

checkDbConnection(); // call at startup

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/data', (req, res) => {
  const { name, email } = req.body;
  console.log('Posting the following data: ', name, email);
  res.send('Success');
});

app.get('/greet', (req, res) => {
  const name = req.query.name;
  res.send(`Hello ${name}!`);
});

app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  res.send(`User ID: ${id}`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
