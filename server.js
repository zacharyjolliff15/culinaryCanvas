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

app.use(express.urlencoded({ extended: true })); // Add this line to parse URL-encoded bodies


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

app.get('/ingredients', (req, res) => {
  const sql = 'select ingredients, units.unit from ingredients inner join units on unit_id = ingredients.units_unit_id;'; // Adjusted SQL to match your table name
  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving data');
      return;
    }
    // Render the Pug template and pass the rows for dynamic content
    res.render('ingredients.jade', {rows: rows});
  });
});

app.post('/ingredients', (req, res) => {
  const { ingredientName, units } = req.body;
  const sql = 'INSERT INTO ingredients (ingredients, units_unit_id) VALUES (?, ?)';
  connection.query(sql, [ingredientName, units], (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Error saving the ingredient');
          return;
      }
      res.send('Ingredient added successfully');
  });
});


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
