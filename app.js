const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

// MySQL connection setup
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'yourusername',
  password: 'yourpassword',
  database: 'yourdatabase'
});

// Connect to MySQL
connection.connect();

// Allow CORS for local development
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Endpoint to get recipes
app.get('/recipes', (req, res) => {
  connection.query('SELECT * FROM recipes', (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
