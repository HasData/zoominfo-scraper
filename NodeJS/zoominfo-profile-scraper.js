const puppeteer = require('puppeteer');
const fs = require('fs');

const baseUrl = "https://www.zoominfo.com/p/Jason-Brosious/6548475613";
let allData = [];

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Открываем страницу с перезапуском при возможных проблемах
  try {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });

    // Рандомная пауза, чтобы имитировать поведение человека
    await page.waitForTimeout(Math.random() * 2000 + 1000);

    // Находим все <script type="application/json"> и забираем текст
    const scripts = await page.$$eval('script[type="application/json"]', nodes =>
      nodes.map(n => n.textContent)
    );

    for (const content of scripts) {
      try {
        const data = JSON.parse(content);

        if (!data) continue;

        // Убираем ненужные ключи
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

  // Сохраняем результат в JSON
  fs.writeFileSync("profile_data.json", JSON.stringify(allData, null, 2), "utf-8");
  console.log("Data saved to profile_data.json");
})();