import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  console.log('Navigating to production...');
  await page.goto('https://reverse-tutor.vercel.app', { waitUntil: 'networkidle2' });
  
  console.log('Done.');
  await browser.close();
})();
