import scrapeSushi from './scrape/scrapeSushi.js';
import scrapeUniSwap from './scrape/scrapeUniSwap.js';
import { google } from "googleapis";
import scrapeKyber from './scrape/scrapeKyber.js';
import puppeteer from 'puppeteer';

await puppeteer.launch({
  userDataDir: './puppeteer-cache', // Ruta a tu carpeta de caché
  // Otras configuraciones...
});



setInterval( async () => {
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

const scrapedDataSushiSwap = await scrapeSushi();
const {buyPriceEthSushi} = scrapedDataSushiSwap;

await new Promise(resolve => setTimeout(resolve, 3000));


const scrapedDataUniSwap = await scrapeUniSwap();
const {buyPriceEthUni} = scrapedDataUniSwap;

const scrapedDataKyberSwap = await scrapeKyber();
const {buyPriceEthKyber} = scrapedDataKyberSwap;


const dateOptions = { timeZone: 'Europe/Madrid' };
const formattedDate = new Date().toLocaleString('es-ES', dateOptions);

// Si la variación es mayor o igual a 1.0 (ajusta según tus necesidades)
const updatedRow = [formattedDate, buyPriceEthUni, buyPriceEthSushi, buyPriceEthKyber];

const maxPrice = Math.max(...updatedRow.slice(1));
const minPrice = Math.min(...updatedRow.slice(1));

// Verifica si la diferencia entre el máximo y el mínimo es al menos 10
const isDifferenceGreaterThan10 = maxPrice - minPrice >= 10;

if(isDifferenceGreaterThan10){
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


console.log("Nueva fila agregada a Arbisim.");

} else {

  console.log("No ha existido la diferencia suficiente para arbitrar")
}

}, 120000);

// scrapeUniSwap();
// scrapeShushi();
// scrapeKyber();