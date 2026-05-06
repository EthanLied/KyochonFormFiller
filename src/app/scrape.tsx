'use server'

import path from 'path';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

export interface scrapeResult {
  result: boolean
  resultMessage: string
  credentials: string
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


const delay = (ms: number) => new Promise(resolve => { let s = 0; const i = setInterval(() => console.log(`waiting... ${++s}s`), 1000); setTimeout(() => { clearInterval(i); resolve(void 0); }, ms); });
const randNum = () => Math.floor(Math.random() * 9) + 1;
const randPass = () => Array.from({ length: 8 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'.charAt(Math.floor(Math.random() * 66))).join('');
const randFirst = () => ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Kenneth', 'Joshua', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Edward', 'Jason', 'Jeffrey', 'Ryan'][Math.floor(Math.random() * 30)];
const randLast = () => ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Moore', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson'][Math.floor(Math.random() * 30)];
const selectIndex = async (el: any, index: number) => el.evaluate((e: HTMLSelectElement, i: number) => { e.selectedIndex = i; e.dispatchEvent(new Event('change', { bubbles: true })); }, index);
const randSelect = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export async function formFiller(): Promise<scrapeResult> {

  let browser: any
  let body: string | undefined
  let password
  let email

  try {

    for (var i = 0; i < 1; i++) {

      // Init browser
      const { browser, kyoChonPage } = await launchBrowser({ proxy: false });
      const tempMailPage = await browser.newPage();


      // Goes to relative pages
      await kyoChonPage.goto('https://loyalty.kyochon.com.my', { waitUntil: 'networkidle2' });
      await tempMailPage.goto('https://temp-mail.org/en/', { waitUntil: 'networkidle2' })


      // Provide clipboard perms
      const context = browser.defaultBrowserContext();
      await context.overridePermissions('https://temp-mail.org', ['clipboard-read', 'clipboard-write']);


      // Sign up page
      await kyoChonPage.bringToFront();
      const signUpBtn = await kyoChonPage.waitForSelector(`::-p-xpath(/html/body/div[5]/div[1]/div/div[1]/div/div/div/div/div/div/div/div[9]/a)`, { timeout: 3000 });
      await signUpBtn.click()
      await delay(20000)


      // Temp mail page
      await tempMailPage.bringToFront();
      await (await tempMailPage.waitForSelector(`::-p-xpath(/html/body/div[3]/div/div/div[2]/div[1]/form/div[2]/button)`, { timeout: 3000 })).click();
      email = await tempMailPage.evaluate(() => navigator.clipboard.readText());
      await kyoChonPage.bringToFront();


      // Input email page
      await (await kyoChonPage.waitForSelector(`::-p-xpath(/html/body/div[5]/div[1]/div/div[3]/div[1]/div[2]/form/div/input)`, { timeout: 3000 })).type(email);
      await (await kyoChonPage.waitForSelector(`::-p-xpath(/html/body/div[5]/div[1]/div/div[3]/div[1]/div[2]/form/button)`, { timeout: 3000 })).click();


      // Input account details page
      const phoneNumInput = await kyoChonPage.waitForSelector(`::-p-xpath(/html/body/div[5]/div[1]/div/div[3]/div/div[2]/form/div[2]/input)`, { timeout: 300000 })
      phoneNumInput.type("16")
      await delay(1000)
      for (let i = 0; i < 7; i++) await phoneNumInput.type(String(randNum()));
      await (await kyoChonPage.waitForSelector(`::-p-xpath(/html/body/div[5]/div[1]/div/div[3]/div/div[2]/form/button)`, { timeout: 300000 })).click();

      password = randPass()

      await (await kyoChonPage.waitForSelector(`::-p-xpath(/html/body/div[5]/div[1]/div/div[3]/div/div[2]/form/div[1]/div/input)`, { timeout: 300000 })).type(password);
      await (await kyoChonPage.waitForSelector(`::-p-xpath(/html/body/div[5]/div[1]/div/div[3]/div/div[2]/form/div[2]/div/input)`, { timeout: 300000 })).type(password);
      await (await kyoChonPage.waitForSelector(`::-p-xpath(/html/body/div[5]/div[1]/div/div[3]/div/div[2]/form/div[3]/div/input)`, { timeout: 300000 })).type(randFirst());
      await (await kyoChonPage.waitForSelector(`::-p-xpath(/html/body/div[5]/div[1]/div/div[3]/div/div[2]/form/div[4]/div/input)`, { timeout: 300000 })).type(randLast());

      const genderSelect = await kyoChonPage.waitForSelector(`::-p-xpath(/html/body/div[5]/div[1]/div/div[3]/div/div[2]/form/div[5]/div/div/select)`, { timeout: 300000 })
      const daySelect = await kyoChonPage.waitForSelector(`::-p-xpath(/html/body/div[5]/div[1]/div/div[3]/div/div[2]/form/div[7]/div[1]/div/div/select)`, { timeout: 300000 })
      const monthSelect = await kyoChonPage.waitForSelector(`::-p-xpath(/html/body/div[5]/div[1]/div/div[3]/div/div[2]/form/div[7]/div[2]/div/div/select)`, { timeout: 300000 })
      const yearSelect = await kyoChonPage.waitForSelector(`::-p-xpath(/html/body/div[5]/div[1]/div/div[3]/div/div[2]/form/div[7]/div[3]/div/div/select)`, { timeout: 300000 })
      const stateSelect = await kyoChonPage.waitForSelector(`::-p-xpath(/html/body/div[5]/div[1]/div/div[3]/div/div[2]/form/div[8]/div/div/select)`, { timeout: 300000 })

      await selectIndex(genderSelect, randSelect(1, 2))
      await selectIndex(daySelect, randSelect(1, 31));
      await selectIndex(monthSelect, randSelect(1, 12));
      await selectIndex(yearSelect, randSelect(10, 30));
      await selectIndex(stateSelect, randSelect(1, 12));

      await (await kyoChonPage.waitForSelector(`::-p-xpath(/html/body/div[5]/div[1]/div/div[3]/div/div[2]/form/div[9]/input)`, { timeout: 300000 })).type("EWOYRJ");
      await (await kyoChonPage.waitForSelector(`::-p-xpath(/html/body/div[5]/div[1]/div/div[3]/div/div[2]/form/button)`, { timeout: 300000 })).click();
      await delay(2000);
      await (await kyoChonPage.waitForSelector(`::-p-xpath(/html/body/div[5]/div[1]/div/div[3]/div/div[2]/form/button)`, { timeout: 300000 })).click();
      await tempMailPage.bringToFront();
      await delay(20000);

      // Temp mail recieve code page
      const emailLink = await tempMailPage.waitForSelector(`::-p-xpath(/html/body/main/div[1]/div/div[2]/div[2]/div/div[1]/div/div[4]/ul/li[3]/div[1]/a)`, { timeout: 300000 });
      const href = await emailLink.evaluate((el: Element) => el.getAttribute('href'));

      await tempMailPage.goto(href, { waitUntil: 'networkidle2' });
      await delay(5000);
      const codeEl = await tempMailPage.waitForSelector(`::-p-xpath(/html/body/main/div[1]/div/div[2]/div[2]/div/div[1]/div/div[2]/div[3]/table/tbody/tr/td/div[2]/div/div/div/div/div/div/div/p[7]/span)`, { timeout: 300000 });
      const code = (await codeEl.evaluate((el: Element) => el.textContent?.trim()))?.match(/\d{6}/)?.[0]

      // Enter Code Page
      await kyoChonPage.bringToFront();
      await (await kyoChonPage.waitForSelector(`::-p-xpath(/html/body/div[5]/div[1]/div/div[3]/div/div[2]/form/div/input)`, { timeout: 300000 })).type(code);
      await (await kyoChonPage.waitForSelector(`::-p-xpath(/html/body/div[5]/div[1]/div/div[3]/div/div[2]/form/button)`, { timeout: 300000 })).click();

      await delay(5000);
      browser?.close()
    }
  }
  catch (e) {
    console.error("Scrape failed", e)
  }
  finally {
    await browser?.close();

  }

  return {
    result: true,
    resultMessage: body ?? '',
    credentials: `\nEmail: ${email} Password: ${password}\n Try it out at: https://loyalty.kyochon.com.my/!`
  }

}

interface launchBrowserReturn { browser: any, kyoChonPage: any }

async function launchBrowser({ proxy }: { proxy: boolean }): Promise<launchBrowserReturn> {

  puppeteer.use(StealthPlugin());

  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-quic',
      '--ignore-certificate-errors',
      '--disable-web-security',
      '--allow-running-insecure-content',
      ...(proxy ? ['--proxy-server=http://unblock.oxylabs.io:60000',
        `--ssl-client-certificate-file=${path.join(process.cwd(), process.env.OXYLABS_CERT_PATH!)}`] : [])
    ]
  } as any);

  const kyoChonPage = await browser.newPage();
  await kyoChonPage.setViewport({ width: 1366, height: 768 });

  if (proxy) {
    await kyoChonPage.authenticate({
      username: process.env.OXYLABS_USERNAME!,
      password: process.env.OXYLABS_PASSWORD!
    });
    await kyoChonPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
  }

  return { browser, kyoChonPage }

}

