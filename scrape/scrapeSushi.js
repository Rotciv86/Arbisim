import { launchPuppeteer } from '../utils/puppeteerUtils.js';

const wait = (timeout) => new Promise(resolve => setTimeout(resolve, timeout));

let isFirstExecution = true;

const tryScrapingOperation = async (page, operation, maxRetries = 3, retryInterval = 2000) => {
  let retries = 0;
  let result;

  while (retries < maxRetries) {
    try {
      result = await operation(page);
      break; // Si tiene éxito, salimos del bucle
    } catch (error) {
      console.error(`Error SUSHI: ${error.message}. Intento ${retries + 1} de ${maxRetries}`);
      retries++;
      await wait(retryInterval);
    }
  }

  return result;
};

const doSomethingElseAfterSuccess = async (result) => {
  // Implementa acciones adicionales después de que la operación sea exitosa
  console.log('Operación exitosa en SUSHISWAP. Resultado:', result);
};

const doSomethingElseAfterReload = async () => {
  // Implementa acciones adicionales después de recargar la página
  console.log('Recargando la página en SUSHISWAP...');
};

const scrapeSushi = async (page) => {
  // const page = await browser.newPage();

  try {
    const operation = async (page) => {
      // await page.goto('https://www.sushi.com/swap', { timeout: 300000 });
    if (isFirstExecution) {

      isFirstExecution = false;
    
      await page.waitForSelector('input[testdata-id="swap-from-input"]', { timeout: 400000 });
      await page.type('input[testdata-id="swap-from-input"]', '1');

      await new Promise(resolve => setTimeout(resolve, 3000));

      await page.waitForSelector('button[testdata-id="swap-to-button"]', { visible: true, timeout: 60000 });

      const buttonSelector = 'button[testdata-id="swap-to-button"]';
      const buttonsa = await page.$$(buttonSelector);

      if (buttonsa.length >= 1) {
        await buttonsa[0].click();
      } else {
        console.log('SUSHI: No se encontraron suficientes botones con el testdata-id "swap-to-button".');
      }

      await page.waitForSelector('input[placeholder="Search by token or address"]', { timeout: 60000 });
      await page.type('input[placeholder="Search by token or address"]', 'USDC');

      await new Promise(resolve => setTimeout(resolve, 3000));

      const specificElementXPath = '//span[contains(text(), "USDC")]';
      const specificElement = await page.$x(specificElementXPath);

      if (specificElement && specificElement.length > 0) {
        await specificElement[0].click();
      } else {
        console.log('SUSHI: No se encontró ningún elemento con el título "USDC".');
      }

    }

      await new Promise(resolve => setTimeout(resolve, 1000));

      const buttons = await page.$$('button');
      let entendidoButton = null;

      for (const button of buttons) {
        const buttonText = await page.evaluate(el => el.innerText, button);
        if (buttonText.includes('Entiendo')) {
          entendidoButton = button;
          break;
        }
      }

      if (entendidoButton) {
        await entendidoButton.click();
      }

    
      await new Promise(resolve => setTimeout(resolve, 6000));
      
      // Obtener el valor del output directamente del atributo 'value'
      const outputValueText = await page.$eval('input[testdata-id="swap-to-input"]', (element) => element.value);
      const buyPriceEthSushi = parseFloat(outputValueText);

      console.log('Valor en USDC en SUSHISWAP:', buyPriceEthSushi);

      return { buyPriceEthSushi };
    };

    const result = await tryScrapingOperation(page, operation);
    await doSomethingElseAfterSuccess(result);
    return result;
  } catch (error) {
    console.error('SUSHI: Ocurrió un error:', error);
    return { buyPriceEthSushi: null };
  } finally {
    // await page.close();
  }
};

export default scrapeSushi;
