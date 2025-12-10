const puppeteer = require('puppeteer');
const fs = require('fs');

const baseUrl = "https://www.zoominfo.com/people-search/industry-health-services-extra-eyJtYW5hZ2VtZW50TGV2ZWwiOlsiRGlyZWN0b3IiXX0%3D";
const pages = 5; // max 5 pages
let allData = [];

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // or true
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  for (let p = 1; p <= pages; p++) {
    const url = pages > 1 ? `${baseUrl}?pageNum=${p}` : baseUrl;

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });

      // Random delay to mimic human behavior
      await page.waitForTimeout(Math.random() * 2000 + 1000);

      // Get all <script type="application/json"> elements
      const scripts = await page.$$eval('script[type="application/json"]', nodes =>
        nodes.map(n => n.textContent)
      );

      for (const content of scripts) {
        try {
          const data = JSON.parse(content);

          if (!data) {
            console.log(`Page ${p}: Empty JSON, wait 30-60s and retry`);
            continue;
          }

          delete data.__nghData__;
          delete data.cta_config;

          allData.push(data);
        } catch (err) {
          console.log(`Page ${p} JSON parse error:`, err.message);
        }
      }

    } catch (err) {
      const msg = err.message.toLowerCase();
      if (msg.includes('429')) {
        console.log(`Page ${p}: Rate limited (429), wait 30-60s and retry`);
        await page.waitForTimeout(Math.random() * 30000 + 30000);
      } else if (msg.includes('403')) {
        console.log(`Page ${p}: Forbidden (403), switch IP/proxy and retry next day`);
      } else if (msg.includes('503')) {
        console.log(`Page ${p}: Service unavailable (503), retry after 30-60s`);
        await page.waitForTimeout(Math.random() * 30000 + 30000);
      } else {
        console.log(`Page ${p} unknown error:`, err.message);
        await page.waitForTimeout(Math.random() * 30000 + 30000);
      }
    }
  }

  await browser.close();

  // Save data to JSON
  fs.writeFileSync('zoominfo_data.json', JSON.stringify(allData, null, 2), 'utf-8');
  console.log('Data saved to zoominfo_data.json');
})();