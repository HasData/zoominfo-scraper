const puppeteer = require('puppeteer');
const fs = require('fs');

const baseUrl = "https://www.zoominfo.com/c/google-llc/16400573";
let allData = [];

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });

    // Random delay to mimic human behavior
    await new Promise(r => setTimeout(r, Math.random() * 2000 + 1000));

    // Get all <script type="application/json">
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
        console.log("JSON parse error:", err.message);
      }
    }

  } catch (err) {
    console.log("Error loading page:", err.message);
  }

  await browser.close();

  // Save to JSON file
  fs.writeFileSync("company_data.json", JSON.stringify(allData, null, 2), "utf-8");
  console.log("Data saved to company_data.json");
})();