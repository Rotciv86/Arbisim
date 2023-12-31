import scrapeSushi from './scrape/scrapeSushi.js';
import scrapeUniSwap from './scrape/scrapeUniSwap.js';
import { google } from "googleapis";
import scrapeKyber from './scrape/scrapeKyber.js';
import { launchPuppeteer } from './utils/puppeteerUtils.js';
import express from 'express';
import axios from 'axios';


const app = express();

app.get('/', (req,res) => {
  res.send('Arbisim en funcionando');
});

app.get('/ping', (req, res) => {
  res.status(200).send('Ping OK');
});

const port = 3000;

app.listen( port , () => {
  console.log(`La aplicación está escuchando en el puerto ${port}`);
});


let isProcessing = false;
let browser;

setInterval( async () => {

  if(isProcessing){

    console.log('Los procesos asincronos aún no han terminado');
    return
  }

  isProcessing = true;

  try{

    const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  const spreadsheetId = "1r-jUnxB0CD_PRuuA_KP1Y5l8ibap6vckTmbtgN522m8"; // Reemplaza con el ID de tu hoja de cálculo
  const googleSheets = google.sheets({ version: "v4", auth: client });

  // Obtén los valores de la Hoja 2 (asume que ya está configurada)
  const range = "Arbisim!A:E"; // Reemplaza con el rango adecuado
  const response = await googleSheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const values = response.data.values || [];
  const lastRow = values[values.length - 1]; // Última fila de datos
  console.log(lastRow)

  const browser = await launchPuppeteer();


    const [scrapedDataSushiSwap, scrapedDataUniSwap, scrapedDataKyberSwap] = await Promise.all([
      scrapeSushi(browser),
      scrapeUniSwap(browser),
      scrapeKyber(browser)
    ]);

    const { buyPriceEthSushi } = scrapedDataSushiSwap;
    const { buyPriceEthUni } = scrapedDataUniSwap;
    const { buyPriceEthKyber } = scrapedDataKyberSwap;



    const dateOptions = { timeZone: 'Europe/Madrid' };
    const formattedDate = new Date().toLocaleString('es-ES', dateOptions);

    // Si la variación es mayor o igual a 1.0 (ajusta según tus necesidades)
    const updatedRow = [formattedDate, buyPriceEthUni, buyPriceEthSushi, buyPriceEthKyber];

    const maxPrice = Math.max(...updatedRow.slice(1));
    const minPrice = Math.min(...updatedRow.slice(1));

    // Verifica si la diferencia entre el máximo y el mínimo es al menos 10
    const isDifferenceGreaterThan10 = maxPrice - minPrice >= 20;
    const isMinPriceRight = minPrice > 0;

    if(isDifferenceGreaterThan10 && isMinPriceRight){
    // Agrega la nueva fila a la Hoja 2
      const resource = {
      values: [updatedRow],
      };

      await googleSheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      resource,
      })


      console.log(`${formattedDate} Nueva fila agregada a Arbisim.`);

    } else {

      console.log(`${formattedDate} No ha existido la diferencia suficiente para arbitrar`)
    }

} catch (error) {

  console.error('Error en la ejecución de los scrapers:', error);

} finally {

  isProcessing = false;
  if(browser){
  await browser.close();
  }
}

}, 300000);


const pingInterval = 13 * 60 * 1000; // Intervalo de ping en milisegundos (6 minutos)
let retryCount = 0;
const maxRetries = 3; // Número máximo de reintentos permitidos

// Realizar un ping interno cada cierto intervalo
setInterval(() => {
  performPing();
}, pingInterval);

function handlePingFailure(errorMessage) {
  console.error('Error en el ping interno:', errorMessage);

  if (retryCount < maxRetries) {
    retryCount++;
    console.log(`Reintentando ping (Intento ${retryCount})...`);
    // Puedes agregar un pequeño retraso antes de reintentar si es necesario
  } else {
    // Alcanzó el número máximo de reintentos, toma medidas adicionales si es necesario
    console.error('Se alcanzó el número máximo de reintentos. Tomando medidas adicionales...');
    // Puedes implementar acciones como reiniciar la aplicación o notificar.
  }
}

async function performPing() {
  try {
    const response = await axios.get('https://arbisim.onrender.com/ping');
    if (response.status === 200 && response.data === 'Ping OK') {
      console.log('Ping interno exitoso. La aplicación está activa.');
      // Reinicia el contador de reintentos después de un ping exitoso
      retryCount = 0;
    } else {
      handlePingFailure('La aplicación puede estar inactiva.');
    }
  } catch (error) {
    handlePingFailure(error.message);
  }
}

// scrapeUniSwap();
// scrapeShushi();
// scrapeKyber();