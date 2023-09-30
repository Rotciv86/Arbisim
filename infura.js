import ethers from 'ethers';
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json?type=module';
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';

// Parámetros de configuración
const currentPoolAddress = computePoolAddress({
  factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
  tokenA: CurrentConfig.tokens.in,
  tokenB: CurrentConfig.tokens.out,
  fee: CurrentConfig.tokens.poolFee,
});

const QUOTER_CONTRACT_ADDRESS = 'YOUR_QUOTER_CONTRACT_ADDRESS'; // Reemplaza con la dirección del contrato Quoter
const amountIn = CurrentConfig.tokens.amountIn; // Reemplaza con la cantidad de USDC que deseas intercambiar

// Obtener proveedor de Ethereum
function getProvider() {
  const provider = new ethers.providers.JsonRpcProvider('YOUR_INFURA_ENDPOINT');
  return provider;
}

// Obtener cotización USDC/ETH
async function getQuote() {
  try {
    // Configurar una referencia al contrato Pool
    const poolContract = new ethers.Contract(
      currentPoolAddress,
      IUniswapV3PoolABI.abi,
      getProvider()
    );

    // Obtener metadatos de Pool del contrato inteligente de Pool
    const [token0, token1, fee] = await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
    ]);

    // Configurar una referencia al contrato de Quoter
    const quoterContract = new ethers.Contract(
      QUOTER_CONTRACT_ADDRESS,
      Quoter.abi,
      getProvider()
    );

    // Obtener cotización utilizando Quoter
    const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
      token0,
      token1,
      fee,
      ethers.utils.parseUnits(amountIn.toString(), CurrentConfig.tokens.in.decimals).toString(),
      0
    );

    console.log('Cotización USDC/ETH:', ethers.utils.formatUnits(quotedAmountOut, CurrentConfig.tokens.out.decimals));
  } catch (error) {
    console.error('Ocurrió un error al obtener la cotización:', error);
  }
}

// Llamar a la función para obtener la cotización
getQuote();
