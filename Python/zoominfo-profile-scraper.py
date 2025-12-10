from seleniumbase import SB
from selenium.webdriver.common.by import By
import time, json, random

base_url = "https://www.zoominfo.com/p/Jason-Brosious/6548475613"
all_data = []

with SB(uc=True, test=True) as sb:
    sb.uc_open_with_reconnect(base_url, 4)
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
        print("Error:", e)

with open("profile_data.json", "w", encoding="utf-8") as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2)
