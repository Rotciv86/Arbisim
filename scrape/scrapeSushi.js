import { launchPuppeteer } from '../utils/puppeteerUtils.js';

const scrapeSushi = async (browser)  => {
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(120000);
  

  try {
    await page.goto('https://www.sushi.com/swap');

      // // Función para esperar el selector o refrescar y volver a intentar
      // const waitForSelectorOrRefresh = async () => {
      //   try {
      //     await page.waitForSelector('input[testdata-id="swap-from-input"]', { timeout: 60000 });
      //   } catch (error) {
      //     console.error('Error al esperar el selector. Intentando refrescar la página.');
      //     await page.reload(); // Refresca la página
      //     await waitForSelectorOrRefresh(); // Vuelve a intentar esperar el selector
      //   }
      // };

      // await waitForSelectorOrRefresh(); // Llama a la función 

    const inputValue = await page.$('input[testdata-id="swap-from-input"]');
    await page.type('input[testdata-id="swap-from-input"]', '1');

    const inputValueHTML = await page.evaluate(el => el.outerHTML, inputValue);
    // console.log('HTML del elemento específico:', inputValueHTML);
    

    await new Promise(resolve => setTimeout(resolve,3000));


    // Click the currency select button
    await page.waitForSelector('button[testdata-id="swap-to-button"]', { visible: true, timeout: 60000});

    const buttonSelector = 'button[testdata-id="swap-to-button"]';
    const buttonsa = await page.$$(buttonSelector);
    
    if (buttonsa.length >= 1) {
      // Selecciona el segundo botón encontrado
      await buttonsa[0].click();
    } else {
      console.log('No se encontraron suficientes botones con el testdata-id "swap-to-button".');
    }
    
    
    
    await page.waitForSelector('input[placeholder="Search by token or address"]', { timeout: 60000});
    await page.type('input[placeholder="Search by token or address"]', 'USDC');
    
    await new Promise(resolve => setTimeout(resolve,3000));

    //*[@id="radix-:rl:"]/div[4]/div[2]/div[1]/div/div/div[1]/div/div/div[1]/div[2]/div/span
    // Esperar a que aparezca el elemento específico
    const specificElementXPath = '//span[contains(text(), "USDC")]';
    const specificElement = await page.$x(specificElementXPath);
    
    if (specificElement && specificElement.length > 0) {
      // Si se encontró el elemento, haz lo que necesites con él
      await specificElement[0].click();
    } else {
      console.log('No se encontró ningún elemento con el título "USDC".');
    }
    

    await new Promise(resolve => setTimeout( resolve , 1000 ));

 
    

    const buttons = await page.$$('button'); // Obtener todos los botones en la página

    let entendidoButton = null;

    for (const button of buttons) {
      const buttonText = await page.evaluate(el => el.innerText, button);
      if (buttonText.includes('Entiendo')) {
        entendidoButton = button;
        break;  // Rompemos el bucle si encontramos el botón con la palabra "Entiendo"
      }
    }

    if (entendidoButton) {
      await entendidoButton.click();
    //   console.log('Se hizo clic en el botón que contiene "Entiendo".');
    } else {
    //   console.log('No se encontró un botón que contenga "Entiendo".');
    }


    const elementHTML = await page.evaluate(el => el.outerHTML, specificElement[0]);
    // console.log('HTML del elemento específico:', elementHTML);


    const htmlOfSpecificElement = await page.evaluate(element => element.outerHTML, specificElement[0]);
    // console.log('HTML del elemento específico:', htmlOfSpecificElement);

    // Esperar 10 segundos para comprobar el valor de output
  

    
    await new Promise(resolve => setTimeout(resolve, 6000));

    // Obtener el valor del output como texto usando la clase específica
    const outputValueText = await page.$eval('input[testdata-id="swap-to-input"]', (element) => element.value);
    
    // Intentar convertir el valor a un número
    const buyPriceEthSushi = parseFloat(outputValueText);
    
      
    
    
    console.log('Valor en USDC en SUSHISWAP:', buyPriceEthSushi);
      
    

    return {buyPriceEthSushi}
  } catch (error) {
    console.error('Ocurrió un error:', error);
    return { buyPriceEthSushi: null }; // Return null if an error occurs

  } finally {
    await page.close();
  }
};


export default scrapeSushi;