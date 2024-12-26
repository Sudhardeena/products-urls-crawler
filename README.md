# Products Urls Crawler
This is a Node.js-based application that crawls multiple e-commerce websites and collects product URLs from them. It uses Axios, Cheerio, and Express to scrape static websites and handle pagination.

### Features
- Crawl Multiple Websites: Crawls product URLs from different domains.
- Pagination Handling: If a website uses pagination, the crawler can follow the pagination links and scrape URLs from all pages.
- Unique URLs: Collects unique product URLs to avoid duplicates.
- Express Server: Provides an HTTP API to trigger the crawling process.

#### Prerequisites
Node.js (>= 14.x)
npm or yarn (for package management)

#### Clone the repository:
git clone https://github.com/Sudhardeena/products-urls-crawler.git
cd product-url-crawler

#### Install dependencies:
````
npm install
````

#### Start the server:
```
npm start
```
The application will be running on http://localhost:8000.

Access the Crawling Endpoint: Visit the URL http://localhost:8000/crawl to initiate the crawling process. The server will return a JSON list of product URLs from the listed domains.

### How It Works
#### The application includes the following main components:
##### Crawl Static Site:
Uses Axios to fetch the HTML content of a domain.  
Cheerio parses the HTML to extract anchor tags (<a>) and checks if the link matches common patterns related to products (e.g., URLs containing "product", "item", "detail").
##### Pagination Handling:
If pagination exists, the crawler will follow "next" page links (e.g., links containing "page=") to collect URLs across multiple pages.
##### Crawl Multiple Sites:
A predefined list of domains is crawled one after the other, and the collected URLs are combined into a final result.
##### Express API:
The server exposes a GET endpoint (/crawl) that triggers the crawl process and returns the collected product URLs in JSON format.
##### Example Response
The response from the /crawl endpoint will be a JSON object with product URLs grouped by domain.
###### Example:
```
[
  {
    "https://www.amazon.in/gp/bestsellers/?ref_=nav_cs_bestsellers": [
      "https://www.amazon.in/dp/B08N5M7S6K",
      "https://www.amazon.in/dp/B08XQZX8W7",
      "https://www.amazon.in/dp/B089G8ZW0F"
    ]
  },
  {
    "https://www.meesho.com": [
      "https://www.meesho.com/product/1",
      "https://www.meesho.com/product/2"
    ]
  }
]
```
#### Configuration
We can add more domains to the domains array in the /crawl endpoint to crawl additional websites.
The crawler currently handles pagination by looking for links containing page=. If the pagination structure changes, you may need to adjust the logic.
### Error Handling
If an error occurs while crawling a website, an error message is logged to the console, and the server returns a 500 status with an error message:
```
{
  "error": "error occurred while crawling"
}
```

### Future Implements:
- crawling dynamic websites, infinite loading using Puppeteer npm package
- recursive crawling
- crawling based on categories
