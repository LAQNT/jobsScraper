const puppeteer = require('puppeteer');
const { createDbConnection, insertRow } = require('../utils/db');

//Puppeteer
const main = async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.iprogrammatori.it/lavoro');

    const jobsData = await page.evaluate(() => {
      const jobsRows = Array.from(document.querySelectorAll('tr'));
      const webData = jobsRows
        .map((job) => ({
          date: job
            .querySelector('td:first-child .tablesaw-cell-content')
            ?.textContent.split('/')
            .reverse()
            .join('-'),
          title: job.querySelector('td:nth-child(3) .tablesaw-cell-content')
            ?.textContent,
          company: job.querySelector('td:nth-child(2) .tablesaw-cell-content')
            ?.textContent,
          location: job.querySelector('td:nth-child(4) .tablesaw-cell-content')
            ?.textContent,
          link: job
            .querySelector('td:nth-child(3) .tablesaw-cell-content a')
            ?.getAttribute('href'),
          insertion_date: new Date()
            .toISOString()
            .slice(0, 19)
            .replace('T', ' '),
        }))
        //to remove the first empty object
        .filter((job) => job.date);
      return webData;
    });
    //close puppeteer
    await browser.close();

    //conect to db
    const db = createDbConnection();

    //execute function to insert data into db
    jobsData.forEach((job) => {
      insertRow(db, job);
    });

    //close db conection
    db.close();
  } catch (error) {
    console.error('Error: ', error);
  }
};

main();
