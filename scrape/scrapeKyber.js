import { launchPuppeteer } from "../utils/puppeteerUtils.js";


const scrapeKyber = async (browser) => {
  const page = await browser.newPage();

  try {
    let secondElement;

    await page.goto('https://kyberswap.com/swap/ethereum/eth-to-usdc', {timeout: 300000});
    
    // Espera a que la página esté completamente cargada
    await page.waitForSelector('body', { timeout: 300000 });
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Busca el segundo elemento
    secondElement = await page.$$('input.token-amount-input');
    
    if (secondElement.length >= 2) {
      // Realiza acciones en el segundo elemento encontrado
      const inputValue = await page.evaluate(el => el.value, secondElement[1]);
      
      let buyPriceEthKyber;
      if (inputValue) {
        buyPriceEthKyber = parseFloat(inputValue);
      }

      console.log('Valor en USDC en KYBERSWAP:', buyPriceEthKyber);
      return { buyPriceEthKyber };
    } else {
      console.log('No se encontraron suficientes elementos.');
      return { buyPriceEthKyber: null };
    }
  } catch (error) {
    console.error('Ocurrió un error en KYBERSWAP:', error);
    return { buyPriceEthKyber: null };
  } finally {
    await page.close();
  }
};

export default scrapeKyber;
