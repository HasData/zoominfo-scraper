const puppeteer = require('puppeteer');
const fs = require('fs');

const baseUrl = "https://www.zoominfo.com/p/Jason-Brosious/6548475613";
let allData = [];

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Load the profile page
  try {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });

    // Wait 1 to 3 seconds before reading the page
    await page.waitForTimeout(Math.random() * 2000 + 1000);

    // Collect the text of every <script type="application/json"> tag
    const scripts = await page.$$eval('script[type="application/json"]', nodes =>
      nodes.map(n => n.textContent)
    );

    for (const content of scripts) {
      try {
        const data = JSON.parse(content);

        if (!data) continue;

        // Drop the hydration and CTA keys
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

  // Save the result as JSON
  fs.writeFileSync("profile_data.json", JSON.stringify(allData, null, 2), "utf-8");
  console.log("Data saved to profile_data.json");
})();