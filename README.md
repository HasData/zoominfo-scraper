![Python](https://img.shields.io/badge/python-3.11+-blue)
![Node.js](https://img.shields.io/badge/node.js-21+-green)


# ZoomInfo Scrapers (Python & Node.js)

[![HasData_bannner](banner.png)](https://hasdata.com/)

A collection of scripts for scraping ZoomInfo data (profiles, companies, search results, universal) in Python and NodeJS.

## Overview

This repo contains:

- **Profile Scrapers** – scrape individual ZoomInfo profiles.
- **Company Scrapers** – scrape company pages.
- **Search Scrapers** – scrape multiple search result pages (up to 5 pages).
- **Universal Scrapers** – flexible scripts to scrape any ZoomInfo page. Supports optional proxies.

Each language has its own folder with scripts ready to run.

## Table of Contents

1. [Requirements](#requirements)
2. [Project Structure](#project-structure)
3. [Python ZoomInfo Scrapers](#python-zoominfo-scrapers)
4. [Node.js ZoomInfo Scrapers](#nodejs-zoominfo-scrapers)
5. [Notes](#notes)
6. [More Resources](#-more-resources)

## Requirements

* **Python 3.11+**
* **pip**
* **Node.js 21+**
* **npm** or **yarn**

## Project Structure

```
zoominfo-scraper/
│
├── Python/
│   ├── zoominfo-profile-scraper.py
│   ├── zoominfo-company-scraper.py
│   ├── zoominfo-search-scraper.py
│   ├── zoominfo-universal-scraper.py
│   └── zoominfo-universal-scraper-proxy.py
│
├── NodeJS/
│   ├── zoominfo-profile-scraper.js
│   ├── zoominfo-company-scraper.js
│   ├── zoominfo-search-scraper.js
│   ├── zoominfo-universal-scraper.js
│   ├── zoominfo-universal-scraper-proxy.js
│   └── universal-zoominfo-scraper-with-proxy.js
│
├── banner.png
└── README.md
```

## Python ZoomInfo Scrapers

This section contains Python scripts for scraping ZoomInfo profiles, companies, and search listings. Each script extracts JSON data from ZoomInfo pages and handles basic anti-bot measures like random delays.

| Script                                | Description                                                                                          |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `zoominfo-profile-scraper.py`         | Scrapes individual profile pages. Extracts JSON data and removes unnecessary internal keys.          |
| `zoominfo-company-scraper.py`         | Scrapes company pages. Collects company metadata and cleans JSON output.                             |
| `zoominfo-search-scraper.py`          | Scrapes search listing pages with pagination. Handles multiple pages and stores all results in JSON. |
| `zoominfo-universal-scraper.py`       | General-purpose scraper for any ZoomInfo URL (profile, company, search).                             |
| `zoominfo-universal-scraper-proxy.py` | Same as universal scraper but supports proxy authentication and usage.                               |

**Notes:**

* All scripts export data in JSON format.
* Random delays are used to reduce risk of blocks.
* [Proxy](https://hasdata.com/blog/proxies-for-web-scraping) support helps with rate-limits and IP bans.
* Can be adapted to scrape other sections of ZoomInfo by changing URLs.

## Node.js ZoomInfo Scrapers

This section contains Node.js scripts for ZoomInfo scraping. They follow the same pattern as the Python scripts. Each one extracts the JSON embedded in the page and waits a random delay between steps, and the proxy variants route traffic through an authenticated proxy.

| Script                                     | Description                                                                   |
| ------------------------------------------ | ----------------------------------------------------------------------------- |
| `zoominfo-profile-scraper.js`              | Scrapes individual profiles, extracts structured JSON data.                   |
| `zoominfo-company-scraper.js`              | Scrapes company pages, exports metadata.                                      |
| `zoominfo-search-scraper.js`               | Scrapes search results with pagination.                                       |
| `zoominfo-universal-scraper.js`            | Universal scraper for any ZoomInfo URL.                                       |
| `zoominfo-universal-scraper-proxy.js`      | Adds proxy support to the universal scraper.                                  |
| `universal-zoominfo-scraper-with-proxy.js` | The same script as `zoominfo-universal-scraper-proxy.js` under a second name. |

**Notes:**

* Runs on Puppeteer. Install it with `npm install puppeteer`, which also downloads the Chrome build it drives.
* The scripts open a visible browser window (`headless: false`). Set `headless: true` in `puppeteer.launch` to run without it.
* JSON output is ready for parsing or further processing.
* Proxy usage and [residential proxy rotation](https://hasdata.com/blog/rotating-proxies-for-web-scraping) is optional but recommended for large scraping tasks.

## Disclaimer

These scripts are for **educational purposes** only. Check ZoomInfo’s Terms of Service and [legal guidance on web scraping](https://hasdata.com/blog/is-web-scraping-legal).

## Notes

* Use random delays to mimic human behavior and avoid blocks.
* Proxy support helps reduce rate limits and IP bans.
* Scrapers export data in JSON format, ready to parse for further use.
* Adjust max pages and URLs according to your scraping needs.

## 📎 More Resources

* Guide: [The Complete Guide to ZoomInfo Scraping in Python](https://hasdata.com/blog/how-to-scrape-zoominfo)
* Discord: [Join the community](https://discord.com/invite/QeuPtWpkAt)
* Star this repo if helpful ⭐