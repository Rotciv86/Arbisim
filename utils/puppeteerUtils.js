// puppeteerUtils.js
import puppeteer from 'puppeteer';
import 'dotenv/config';


export const launchPuppeteer = async () => {
  const browser = await puppeteer.launch({
    args: ["--disable-setuid-sandbox", "--no-sandbox", "--single-process", "--no-zygote"],
    executablePath: process.env.NODE_ENV === 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
    headless: "true",
    timeout: 600000// Otras configuraciones...
  });

  return browser;
};
