import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  
  // Set localStorage so we skip login
  await page.evaluate(() => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('examType', 'JEE Main');
  });
  
  await page.reload({ waitUntil: 'networkidle2' });
  
  console.log('Clicking Past Papers...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const pyq = buttons.find(b => b.innerText.includes('Past Papers'));
    if(pyq) pyq.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('Done.');
  await browser.close();
})();
