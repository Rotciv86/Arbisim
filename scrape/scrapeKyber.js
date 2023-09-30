import puppeteer from 'puppeteer';

const scrapeKyber = async ()  => {
  const browser = await puppeteer.launch({headless: false, slowMo: 25 });
  const page = await browser.newPage();

  try {

    // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    let secondElement;

    await page.goto('https://kyberswap.com/swap/ethereum/eth-to-usdc');


   
    // await page.waitForSelector('amount-input.token-amount-input', { timeout: 120000 });

    const elements = await page.$$('input.token-amount-input');

    if (elements.length >= 2) {
      secondElement = elements[1];
      // Realiza acciones en el segundo elemento encontrado
    } else {
      console.log('No se encontraron suficientes elementos.');
    }

    
    const inputValue = await page.evaluate(el => el.getAttribute('value'), secondElement);

    let buyPriceEthKyber;
    // Asegúrate de que inputValue no sea null o undefined antes de convertirlo a un número
    if (inputValue) {
    buyPriceEthKyber = parseFloat(inputValue);
    }


    

    await new Promise(resolve => setTimeout(resolve,3000));


 
    
    
    console.log('Valor en USDC en KYBERSWAP:', buyPriceEthKyber);
      
    

    return {buyPriceEthKyber}
  } catch (error) {
    console.error('Ocurrió un error:', error);
    return { buyPriceEthKyber: null }; // Return null if an error occurs

  } finally {
    await browser.close();
  }
};


export default scrapeKyber;