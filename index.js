const axios = require("axios");
const cheerio = require("cheerio");
// const puppeteer = require("puppeteer");
const { URL } = require("url");
const express = require("express");

const port = process.env.PORT || 8000;

const app = express();

// Function to crawl the static websites with axios and cheerio tools
async function crawlStaticSite(domain) {
  let productUrls = [];
  try {
    const response = await axios.get(domain);
    // console.log(response.data);
    const $ = cheerio.load(response.data);

    // example product URL patterns
    const productPatterns = ["product", "item", "p", "detail"];

    // Finding all anchor tags and checking if they match the product URL patterns
    $("a").each((index, element) => {
      const href = $(element).attr("href");
      if (href) {
        const url = new URL(href, domain);
        const path = url.pathname.toLowerCase();

        // Checking the URL path match any product patterns
        if (productPatterns.some((pattern) => path.includes(pattern))) {
          productUrls.push(url.href);
        }
      }
    });
  } catch (error) {
    console.error(`Error crawling ${domain}: ${error.message}`);
  }
  return productUrls;
}

// Function to handle pagination (if pagination is presented in current page)
async function crawlPagination(domain, startUrl) {
  let allUrls = [];
  let currentPage = startUrl;

  while (currentPage) {
    console.log(`Crawling page: ${currentPage}`);
    try {
      let pageUrls = await crawlStaticSite(currentPage);
      allUrls = [...allUrls, ...pageUrls];

      // Find next page link
      const nextPageUrl = await axios
        .get(currentPage, { maxRedirects: 3 })
        .then((response) => {
          const $ = cheerio.load(response.data);
          let next = null;
          $("a").each((index, element) => {
            const href = $(element).attr("href");
            if (href && href.includes("page=")) {
              // Assuming pagination includes 'page='
              next = new URL(href, domain).href;
            }
          });
          return next;
        });
      currentPage = nextPageUrl ? new URL(nextPageUrl, domain).href : null;
    } catch (error) {
      console.log(error.message);
      break;
    }
  }

  return allUrls;
}

// function logic to crawl multiple sites
async function crawlSites(domains) {
  let allProductUrls = [];

  for (const domain of domains) {
    console.log(`Crawling ${domain}...`);
    console.log(
      "___________________________________________________________________________________________"
    );
    // Crawl the site using Puppeteer or Axios
    let productUrls = [];

    // If pagination is used, we first start with the base page
    const startUrl = domain; // You can adjust based on how the domain works
    productUrls = await crawlPagination(domain, startUrl);
    productUrls = [...new Set(productUrls)];
    console.log(productUrls);
    console.log(`Found ${productUrls.length} unique product URLs:`);
    console.log("**************************");

    // Removing duplicates and adding to the final list of products
    allProductUrls = [...allProductUrls, { [domain]: productUrls }];
  }

  return allProductUrls;
}

app.get("/", (req, res) => {
  res.send(
    "Welcome, viste https://products-urls-crawler.onrender.com/crawl to view products list"
  );
});

app.get("/crawl", async (req, res) => {
  // list of domains
  const domains = [
    "https://www.amazon.in/gp/bestsellers/?ref_=nav_cs_bestsellers",
    "https://www.meesho.com",
    "https://www.snapdeal.com/products/mobiles-cases-covers?sort=plrty",
    "https://www.shopsy.in/kajal-online",
    "https://www.veromoda.in",
    "https://vanheusenindia.abfrl.in/c/durapress-travel-lite-collection",
    "https://www.titan.co.in",
    "https://www.limeroad.com",
    "https://www.jackjones.in/jj-all-product",
  ];

  try {
    const allProductUrls = await crawlSites(domains);
    console.log("****************crawling completed***********");
    res.json(allProductUrls);
  } catch (error) {
    console.error("Error during crawling:", err);
    res.status(500).json({ error: "error occured while crawling" });
  }
});

app.listen(port, () => console.log(`app is running on port ${port}`));
