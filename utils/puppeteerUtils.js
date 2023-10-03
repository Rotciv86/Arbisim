// puppeteerUtils.js
import puppeteer from 'puppeteer';

export const launchPuppeteer = async () => {
  const browser = await puppeteer.launch({
    args: ["--disable-setuid-sandbox", "--no-sandbox", "--single-process", "--no-zygote"],
    executablePath: process.env.NODE_ENV === 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
    // Otras configuraciones...
  });

  return browser;
};
