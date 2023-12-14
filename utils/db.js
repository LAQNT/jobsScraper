const sqlite3 = require('sqlite3').verbose();

const createDbConnection = () => {
  try {
    const db = new sqlite3.Database('jobs.db');
    console.log('Connected to SQLite database.');
    return db;
  } catch (error) {
    return console.error('Error: ', error);
  }
};

const insertRow = (db, job) => {
  db.get(
    'SELECT * FROM jobs WHERE link = ?',
    [job.link],
    (error, existingRecord) => {
      try {
        if (!existingRecord) {
          db.run(
            `INSERT INTO jobs (date, title, company, location, link, insertion_date) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              job.date,
              job.title,
              job.company,
              job.location,
              job.link,
              job.insertion_date,
            ],
            function (error) {
              if (error) {
                console.error(error.message);
              }
              console.log(
                `Inserted rows with the following IDs: ${this.lastID}`
              );
            }
          );
        } else {
          console.log('Record already exists, skipping insertion');
        }
      } catch {
        console.error(error.message);
      }
    }
  );
};

module.exports = {
  createDbConnection,
  insertRow,
};
