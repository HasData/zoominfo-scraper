from seleniumbase import SB
from selenium.webdriver.common.by import By
import time, json, random

base_url = "https://www.zoominfo.com/people-search/industry-health-services-extra-eyJtYW5hZ2VtZW50TGV2ZWwiOlsiRGlyZWN0b3IiXX0%3D"
all_data = []

with SB(uc=True, test=True) as sb:
    for page in range(1, 6):
        url = f"{base_url}?pageNum={page}"
        sb.uc_open_with_reconnect(url, 4)
        # Random delay to mimic human behavior and reduce anti-bot detection
        time.sleep(random.uniform(1, 3))
        try:
            scripts = sb.find_elements('script[type="application/json"]', by=By.CSS_SELECTOR)
            for el in scripts:
                content = el.get_attribute("innerHTML")
                data = json.loads(content)
                data.pop("__nghData__", None)
                data.pop("cta_config", None)
                all_data.append(data)
        except Exception as e:
            print(f"Page {page} error:", e)

with open("search_data.json", "w", encoding="utf-8") as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2)
