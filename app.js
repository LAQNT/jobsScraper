const sqlite3 =
  require('sqlite3').verbose(); /*verbose => computer gives details of what its doing*/
const express = require('express');
const app = express();
const { createDbConnection } = require('./utils/db');

const db = new sqlite3.Database('jobs.db');
const HTTP_PORT = 3001;

// set EJS
app.set('view engine', 'ejs');
// middleware => path to static files
app.use(express.static(__dirname + '/public'));

// Get jobs
const getAllJobs = async (req, res) => {
  try {
    // Query to db
    db.all(
      'SELECT * FROM jobs WHERE LOWER(location) LIKE ? OR LOWER(location) LIKE ? ORDER BY insertion_date DESC LIMIT 80',
      ['%milano%', '%smart working%'],
      (err, rows) => {
        try {
          // Render jobs EJS template
          res.render('index', { jobData: rows });
        } catch (error) {
          // Handle Query error
          console.error('Error: ', err.message);
          return res.status(500).json({
            success: false,
            message: 'Failed to fetch jobs',
          });
        }
      }
    );
    // Handle error
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get jobs',
    });
  }
};

createDbConnection();
// Initialize server
app.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`);
});
// Enpoint + execute function => db query
app.get('/jobs', getAllJobs);
