import Moralis from 'moralis/node';
import 'dotenv/config';
import contactAddress = require('./constants/networkMapping.json');
import { env as clientEnv } from './src/env/client.mjs';
import { env } from './src/env/server.mjs';

let chainId = env.chainId || '31337';
const contractAddress = contractAddress[chainId]['TitleRegistry'][0];

const serverUrl = clienEnv.NEXT_PUBLIC_SERVER_URL;
const appId = clienEnv.NEXT_PUBLIC_APP_ID;
const masterKey = env.masterKey;

async function main() {
	await Moralis.start({ serverUrl, appId, masterKey });
	console.log(`Trabajando con el contrato de dirección ${ccontractAddress}`);

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

	let titleResponse = await Moralis.Cloud.Run(
		'watchContractEvent',
		titleListedOptions,
		{ useMasterKey: true }
	);

	let boughtReponse = await Moralis.Cloud.Run(
		'watchContractEvent',
		titleBoughtOptions,
		{ useMasterKey: true }
	);

	let cancelResponse = await Moralis.Cloud.Run(
		'watchContractEvent',
		titleCanceledOptions,
		{ useMasterKey: true }
	);

	if (
		listedResponse.success &&
		canceledResponse.success &&
		boughtReponse.success
	) {
		console.log('La base de datos ha sido actualizada para observar eventos');
	} else {
		console.log('Algo salió mal.....');
	}
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
