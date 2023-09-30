import puppeteer from 'puppeteer';

const scrape1Inch = async ()  => {
  const browser = await puppeteer.launch({headless: false, slowMo: 25 });
  const page = await browser.newPage();

  try {

    // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');


    await page.goto('https://app.1inch.io/#/1/simple/swap/ETH/USDC');

    await new Promise(resolve => setTimeout(resolve,30000));

   
    // await page.waitForSelector('amount-input.token-amount-input', { timeout: 120000 });

    const element = await page.$('amount-input.token-amount-input');
    const titleAttribute = await page.evaluate(el => el.getAttribute('title'), element);

    // Asegúrate de que titleAttribute no sea null o undefined antes de convertirlo a un número
    if (titleAttribute) {
    const buyPriceEth1Inch = parseFloat(buyPriceEth1Inch);
    console.log('Valor del atributo title como número:', buyPriceEth1Inch);
    } else {
    console.log('El atributo title no está presente en el elemento.');
    }


    

    await new Promise(resolve => setTimeout(resolve,3000));


 
    
    
    console.log('Valor en USDC en SUSHISWAP:', buyPriceEth1Inch);
      
    

    return {buyPriceEth1Inch}
  } catch (error) {
    console.error('Ocurrió un error:', error);
    return { buyPriceEth1Inch: null }; // Return null if an error occurs

  } finally {
    await browser.close();
  }
};


export default scrape1Inch;