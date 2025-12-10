from seleniumbase import SB
from selenium.webdriver.common.by import By
import time, json, random

# Base URL for the page (search, person, or company)
base_url = "https://www.zoominfo.com/people-search/industry-health-services-extra-eyJtYW5hZ2VtZW50TGV2ZWwiOlsiRGlyZWN0b3IiXX0%3D"  # or person/company URL
pages = 5  # for search pages set max 5 pages; for single profile/company set 1 
all_data = []

# Format: "username:password@ip:port" or "ip:port"
# Note: Do not use 'http://' prefix inside the SB context argument
proxy_string = "user123:securepass@proxy-provider.com:8000"


with SB(uc=True, test=True, proxy=proxy_string) as sb:  # <-- add proxy here
    for page in range(1, pages + 1):
        url = f"{base_url}?pageNum={page}" if pages > 1 else base_url
        sb.uc_open_with_reconnect(url, 4)
        
        # Random delay to mimic human behavior and reduce anti-bot detection
        time.sleep(random.uniform(1, 3))
        
        try:
            # Find all JSON scripts containing page data
            scripts = sb.find_elements('script[type="application/json"]', by=By.CSS_SELECTOR)
            
            for el in scripts:
                # Extract and parse JSON content
                content = el.get_attribute("innerHTML")
                data = json.loads(content)
                
                # If JSON is empty, likely a temporary block/honeypot
                if not data:
                    print(f"Page {page}: Empty JSON, wait 30-60s and retry")
                    continue
                
                # Remove internal keys we don't need
                data.pop("__nghData__", None)
                data.pop("cta_config", None)
                
                # Store the cleaned data
                all_data.append(data)
        
        except Exception as e:
            # Catch any errors for this page
            err_msg = str(e).lower()
            if "429" in err_msg:
                print(f"Page {page}: Rate limited (429), wait 30-60s and retry")
                time.sleep(random.uniform(30, 60))
            elif "403" in err_msg:
                print(f"Page {page}: Forbidden (403), switch IP/proxy and retry next day")
            elif "503" in err_msg:
                print(f"Page {page}: Service unavailable (503), ZoomInfo outage, retry after 5 min")
                time.sleep(random.uniform(30, 60))
            else:
                print(f"Page {page} unknown error:", e)
                time.sleep(random.uniform(30, 60))

# Save all collected data to a JSON file
with open("zoominfo_data.json", "w", encoding="utf-8") as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2)
