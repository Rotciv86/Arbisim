import { launchPuppeteer } from '../utils/puppeteerUtils.js';

const scrapeUniSwap = async (browser) => {
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(300000);

  try {
    await page.goto('https://app.uniswap.org/swap');
    await page.waitForSelector('input#swap-currency-input', { timeout: 60000 });
    const inputValue = await page.$('input#swap-currency-input');
    await page.type('input#swap-currency-input', '1');

    // console.log('HTML del elemento específico:', inputValueHTML);
    
    // Click the currency select button
    await page.waitForXPath('//span[contains(text(), "Seleccionar token") or contains(text(), "Select token")]');
    const spanElement = await page.$x('//span[contains(text(), "Seleccionar token") or contains(text(), "Select token")]');
    if (spanElement.length > 0) {
      await spanElement[0].click();
    }
        await page.waitForSelector('input#token-search-input');
    await page.type('input#token-search-input', 'USDC');

    await new Promise(resolve => setTimeout(resolve,1000));

    // Esperar a que aparezca el elemento específico
    const specificElementXPath = '//div[contains(text(), "USDCoin") or contains(text(), "USD Coin USDC")]';
    const specificElement = await page.$x(specificElementXPath);
    
    if (specificElement && specificElement.length > 0) {
      // Si se encontró el elemento, haz lo que necesites con él
      await specificElement[0].click();
    } else {
      console.log('UNI: No se encontró ningún elemento con el título "USDCoin".');
    }
    

    await new Promise(resolve => setTimeout( resolve , 1000 ));

    // const buttonSelector = 'body > reach-portal:nth-child(11) > div:nth-child(3) > div > div > div > div > div > button.sc-bczRLJ.lfsInV.Button__BaseButton-sc-983e32f-1.Button__ButtonPrimary-sc-983e32f-2.TokenSafety__StyledButton-sc-cd7c17f3-5.chcwUq.hHmmDQ.jjIolG';

    // // Esperar a que aparezca el botón "Entiendo" con un tiempo máximo de 30000ms (30 segundos)
    // const button = await page.waitForSelector(buttonSelector, { timeout: 5000 }).catch(() => null);
    
    // if (button) {
    //   // Si el botón está presente, hacer clic en él
    //   await button.click();
    //   console.log('Se hizo clic en el botón "Entiendo".');
    // } else {
    //   console.log('El botón "Entiendo" no está presente en la página.');
    // }
    

    const buttons = await page.$$('button'); // Obtener todos los botones en la página

    let entendidoButton = null;

    for (const button of buttons) {
      const buttonText = await page.evaluate(el => el.innerText, button);
      if (buttonText.includes('Entiendo')|| buttonText.includes('I understand')) {
        entendidoButton = button;
        break;  // Rompemos el bucle si encontramos el botón con la palabra "Entiendo"
      }
    }

    if (entendidoButton) {
      await entendidoButton.click();
      // console.log('Se hizo clic en el botón que contiene "Entiendo".');
    } else {
      // console.log('No se encontró un botón que contenga "Entiendo".');
    }


    const elementHTML = await page.evaluate(el => el.outerHTML, specificElement[0]);
    // console.log('HTML del elemento específico:', elementHTML);


    const htmlOfSpecificElement = await page.evaluate(element => element.outerHTML, specificElement[0]);
    // console.log('HTML del elemento específico:', htmlOfSpecificElement);

    // Esperar 10 segundos para comprobar el valor de output
  

    
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Obtener el valor del output como texto usando la clase específica
    const outputValueText = await page.$eval('input#swap-currency-output', (element) => element.value);
    
    // Intentar convertir el valor a un número
    const buyPriceEthUni = parseFloat(outputValueText);
      
    const outputElementHTML = await page.$eval('input#swap-currency-output', element => element.outerHTML);
    // console.log('HTML del elemento output:', outputElementHTML);
    
    console.log('Valor en USDC en UNISWAP:', buyPriceEthUni);
      
    
    return {buyPriceEthUni};
    
  } catch (error) {
    console.error('UNI: Ocurrió un error:', error);
    return { buyPriceEthUni: null }; // Return null if an error occurs
  } finally {
    await page.close();
  }
};

export default scrapeUniSwap;


