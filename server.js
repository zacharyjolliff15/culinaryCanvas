const express = require('express');
const path = require('path');
const mysql = require('mysql');

const app = express();
const port = 3000;

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

app.get('/ingredients.html', (req, res) => {
  // Query to select all records from a table (replace 'your_table_name' with your actual table name)
  const sql = 'SELECT * FROM CulinaryCanvas.ingredients';

  // Execute the query
  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving data');
      return;
    }

    // Display the results in the console
    console.log('All records from the table:');
    rows.forEach((row) => {
      console.log(row);
    });

    // Send response to the client
    res.send('Data displayed in the console');
  });
});


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
