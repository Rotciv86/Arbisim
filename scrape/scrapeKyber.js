import { launchPuppeteer } from "../utils/puppeteerUtils.js";

const wait = (timeout) => new Promise(resolve => setTimeout(resolve, timeout));

const tryScrapingOperation = async (page, operation, maxRetries = 3, retryInterval = 2000) => {
  let retries = 0;
  let result;

  while (retries < maxRetries) {
    try {
      result = await operation(page);
      break; // Si tiene éxito, salimos del bucle
    } catch (error) {
      console.error(`Error: ${error.message}. Intento ${retries + 1} de ${maxRetries}`);
      retries++;
      await wait(retryInterval);
    }
  }

  return result;
};

const doSomethingElseAfterSuccess = async (result) => {
  // Implementa acciones adicionales después de que la operación sea exitosa
  console.log('Operación exitosa. Resultado:', result);
};

const doSomethingElseAfterReload = async () => {
  // Implementa acciones adicionales después de recargar la página
  console.log('Recargando la página...');
};

const scrapeKyber = async (browser) => {
  const page = await browser.newPage();

  try {
    const operation = async (page) => {
      await page.goto('https://kyberswap.com/swap/ethereum/eth-to-usdc', { timeout: 300000 });

      // Espera a que la página esté completamente cargada
      await page.waitForSelector('body', { timeout: 300000 });

      // Espera adicional (ajusta según sea necesario)
      await wait(2000);

      // Busca el segundo elemento
      const secondElement = await page.$$('input.token-amount-input');

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
        throw new Error('No se encontraron suficientes elementos.');
      }
    };

    const result = await tryScrapingOperation(page, operation);
    await doSomethingElseAfterSuccess(result);
    return result;
  } catch (error) {
    console.error('Ocurrió un error en KYBERSWAP:', error);
    // Implementa acciones adicionales si es necesario
    return { buyPriceEthKyber: null };
  } finally {
    await page.close();
  }
};

export default scrapeKyber;
