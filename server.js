const express = require('express');
const path = require('path');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Setup Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'CulinaryCanvas'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

app.get('/ingredients', (req, res) => {
  const sql = 'SELECT * FROM ingredients'; // Adjusted SQL to match your table name
  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving data');
      return;
    }
    // Render the Pug template and pass the rows for dynamic content
    res.render('ingredients', {rows: rows});
  });
});



// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
