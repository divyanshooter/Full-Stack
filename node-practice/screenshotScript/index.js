const path=require('path');
const puppeteer = require("puppeteer");

const url = process.argv[2];

if (!url) {
  throw "Please provide the website url";
}

async function capture() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
   const page=await browser.newPage();
   await page.goto(url);
  //  const filename=path.join('screenshots','screenShot'+new Date().toISOString()+'.png');
  //  console.log(filename);
   await page.screenshot({path:'screenshots/screenshot.png'});
   browser.close();
  
}

capture();
