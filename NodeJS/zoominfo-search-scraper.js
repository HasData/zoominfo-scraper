const puppeteer = require('puppeteer');
const fs = require('fs');

const baseUrl = "https://www.zoominfo.com/people-search/industry-health-services-extra-eyJtYW5hZ2VtZW50TGV2ZWwiOlsiRGlyZWN0b3IiXX0%3D";
const pages = 5; // max 5 pages
let allData = [];

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  for (let pageNum = 1; pageNum <= pages; pageNum++) {
    const url = `${baseUrl}?pageNum=${pageNum}`;

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });

      // Random delay to mimic human behavior
      await page.waitForTimeout(Math.random() * 2000 + 1000);

      const scripts = await page.$$eval('script[type="application/json"]', nodes =>
        nodes.map(n => n.textContent)
      );

      for (const content of scripts) {
        try {
          const data = JSON.parse(content);
          if (!data) continue;

          // Remove internal keys we don't need
          delete data.__nghData__;
          delete data.cta_config;

          allData.push(data);
        } catch (err) {
          console.log(`Page ${pageNum} JSON parse error:`, err.message);
        }
      }

      console.log(`Page ${pageNum} done`);

    } catch (err) {
      console.log(`Page ${pageNum} load error:`, err.message);
    }

    // Optional: small delay between pages
    await page.waitForTimeout(Math.random() * 2000 + 1000);
  }

  await browser.close();

  // Save all data to a JSON file
  fs.writeFileSync("search_data.json", JSON.stringify(allData, null, 2), "utf-8");
  console.log("All data saved to search_data.json");
})();
