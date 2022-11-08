import Moralis from 'moralis/node';
import 'dotenv/config';
import contractAddresses from './constants/networkMapping.json';
import { env as clientEnv } from './src/env/client.mjs';
import { env } from './src/env/server.mjs';

interface contractAddressesInterface {
	[key: string]: contractAddressesTitleInterface;
}

interface contractAddressesTitleInterface {
	[key: string]: string[];
}
let chainId = env.chainId || '31337';
let moralisChainId = chainId == '31337' ? '1337' : chainId;

const serverUrl = clientEnv.NEXT_PUBLIC_SERVER_URL;
const appId = clientEnv.NEXT_PUBLIC_APP_ID;
const masterKey = env.masterKey;

async function main() {
	await Moralis.start({ serverUrl, appId, masterKey });
	const addresses: contractAddressesInterface = contractAddresses;

	const contractAddress = chainId
		? addresses[parseInt(chainId!).toString()]!['TitleRegistry']![0]
		: null;

	console.log(`Trabajando con el contrato de dirección ${contractAddress}`);

	let titleListedOptions = {
		chainId: moralisChainId,
		sync_historical: true,
		topic: 'TitleListed(address,address, uint256, uint256)',
		abi: {
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: 'address',
					name: 'seller',
					type: 'address',
				},
				{
					indexed: true,
					internalType: 'address',
					name: 'titleAddress',
					type: 'address',
				},
				{
					indexed: true,
					internalType: 'uint256',
					name: 'tokenId',
					type: 'uint256',
				},
				{
					indexed: false,
					internalType: 'uint256',
					name: 'price',
					type: 'uint256',
				},
			],
			name: 'TitleListed',
			type: 'event',
		},
		tableName: 'TitleListed',
	};

	let titleBoughtOptions = {
		chainId: moralisChainId,
		sync_historical: true,
		topic: 'TitleBought(address,address, uint256, uint256)',
		abi: {
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: 'address',
					name: 'buyer',
					type: 'address',
				},
				{
					indexed: true,
					internalType: 'address',
					name: 'titleAddress',
					type: 'address',
				},
				{
					indexed: true,
					internalType: 'uint256',
					name: 'titleId',
					type: 'uint256',
				},
				{
					indexed: false,
					internalType: 'uint256',
					name: 'price',
					type: 'uint256',
				},
			],
			name: 'TitleBought',
			type: 'event',
		},
		tableName: 'TitleBought',
	};

	let titleCanceledOptions = {
		chainId: moralisChainId,
		sync_historical: true,
		topic: 'TitleCanceled(address,address, uint256)',
		abi: {
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: 'address',
					name: 'seller',
					type: 'address',
				},
				{
					indexed: true,
					internalType: 'address',
					name: 'titleAddress',
					type: 'address',
				},
				{
					indexed: true,
					internalType: 'uint256',
					name: 'tokenId',
					type: 'uint256',
				},
			],
			name: 'TitleCanceled',
			type: 'event',
		},
		tableName: 'TitleCanceled',
	};

// 	let titleResponse = await Moralis.Cloud.Run(
// 		'watchContractEvent',
// 		titleListedOptions,
// 		{ useMasterKey: true }
// 	);
//
// 	let boughtReponse = await Moralis.Cloud.Run(
// 		'watchContractEvent',
// 		titleBoughtOptions,
// 		{ useMasterKey: true }
// 	);
//
// 	let cancelResponse = await Moralis.Cloud.Run(
// 		'watchContractEvent',
// 		titleCanceledOptions,
// 		{ useMasterKey: true }
// 	);
//
// 	if (
// 		listedResponse.success &&
// 		canceledResponse.success &&
// 		boughtReponse.success
// 	) {
// 		console.log('La base de datos ha sido actualizada para observar eventos');
// 	} else {
// 		console.log('Algo salió mal.....');
// 	}
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
