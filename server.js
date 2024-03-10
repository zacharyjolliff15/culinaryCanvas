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

app.get('/newRecipe', (req, res) => {
  const sql = 'SELECT ingredients FROM `CulinaryCanvas`.`ingredients`'; // Adjust the query according to your schema
  connection.query(sql, (err, ingredients) => {
    if (err) {
      console.error('Error fetching ingredients:', err);
      res.status(500).send('Error fetching ingredients');
      return;
    }
    // Assuming you're using Pug and have a template for newRecipe
    res.render('newRecipe.jade', { ingredients });
  });
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

app.get('/viewRecipes', (req, res) => {
  const sql = 'select meals, recipe, ingredient, quantity, units.unit from recipes inner join units where units_unit_id = units.unit_id'; 
  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving data');
      return;
    }
    res.render('viewRecipes.jade', {rows: rows});
  });
});

app.post('/newRecipe', (req, res) => {
  // Extract information from request body
  const { mealType, recipeName, ingredient, quantity, units } = req.body;
  // Assuming `ingredient` is an array. If not, adjust accordingly.

  // Insert recipe into the database. This is a simplified example. You'll need to handle each ingredient.
  // Consider using transactions if inserting into multiple tables or handling multiple ingredients.
  const sql = 'INSERT INTO recipes (meals, recipe, ingredient, quantity, units_unit_id) VALUES ?';
  
  // Prepare values. This part needs to be adjusted based on how you receive and process ingredients.
  const values = ingredient.map((ing, index) => [mealType, recipeName, ing, quantity[index], units[index]]);

  connection.query(sql, [values], (err, result) => {
    if (err) {
      console.error('Error inserting recipe:', err);
      res.status(500).send('Error saving the recipe');
      return;
    }
    res.send('Recipe added successfully');
  });
});


app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
