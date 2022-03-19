import puppeteer, { Browser, Page } from "puppeteer";
import fs from "fs";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  await page.on("request", (request) => {
    if (request.resourceType() === "script") {
      request.abort();
      return;
    }
    request.continue();
  });
  await page.goto(
    "https://www.cifraclub.com.br/johnny-cash/gods-gonna-cut-you-down/"
  );

  const ciferText = await page.$eval(
    ".cifra_cnt pre",
    (element) => element.innerHTML
  );

  fs.writeFile("./index.html", ciferText, (err) => {
    if (err) {
      console.log(err);
    }
  });

  await page.screenshot({ path: "example.png", fullPage: true });

  await browser.close();
})();
