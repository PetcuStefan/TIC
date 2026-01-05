//server app
const express = require('express');
const app = express();
const httpLogger = require('morgan');
const cors = require('cors');
const port = 3000;

app.use(httpLogger('dev'));
app.use(cors()) //see more at https://www.npmjs.com/package/cors
app.use(express.urlencoded({ extended: false }))
app.use(express.json()) //we expect JSON data to be sent as payloads

app.get('/', (req, res) => {
  res.send('Hello World!')
});

// Simple post route example
app.post('/data', (req, res) => {
  // destructuring
  const { name, email } = req.body; // validates keys exist
  
  // bad example:
  // let data = req.body;
  // console.log(data.name, data.email);
  
  console.log('Posting the following data: ', name, email);
  res.send('Success');
});

// Query params example
app.get('/greet', (req, res) => {
  const name = req.query.name;
  res.send(`Hello ${name}!`);
});
// Access: localhost:3000/greet?name=John

// route params example
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  res.send(`User ID: ${id}`);
});
// Access: localhost:3000/users/123

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});