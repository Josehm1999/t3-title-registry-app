import type { NextPage } from 'next';
import { Form, useNotification, Button } from 'web3uikit';
import { FormDataReturned } from 'web3uikit/dist/components/Form/types';
import titleAbi from '../../constants/BasicNft.json';
import networkMapping from '../../constants/networkMapping.json';
import { ethers } from 'ethers';
import { useChain, useMoralis, useWeb3Contract } from 'react-moralis';
import titleRegistryAbi from '../../constants/TitleRegistry.json';
import { useEffect, useState } from 'react';

type NetworkConfigItem = {
	TitleRegistry: string[];
};

type NetworkConfigMap = {
	[chainid: string]: NetworkConfigItem;
};

type chainType =
	| 'eth'
	| '0x1'
	| 'ropsten'
	| '0x3'
	| 'rinkeby'
	| '0x4'
	| 'goerli'
	| '0x5'
	| 'kovan'
	| '0x2a'
	| 'polygon'
	| '0x89'
	| 'mumbai'
	| '0x13881'
	| 'bsc'
	| '0x38'
	| 'bsc testnet'
	| '0x61'
	| 'avalanche'
	| '0xa86a'
	| 'avalanche testnet'
	| '0xa869'
	| 'fantom'
	| '0xfa';

const Home: NextPage = () => {
	const { chainId } = useChain();
	const { account, isWeb3Enabled } = useMoralis();
	const chainString = chainId ? parseInt(chainId).toString() : '1337';
	const dispatch = useNotification();
	const [proceeds, setProceeds] = useState('0');
	const currentNetworkMapping = (networkMapping as NetworkConfigMap)[
		chainString
	];

	if (!currentNetworkMapping) {
		const error = `No registry found in networkMapping.json matching the current chain ID of ${chainString}`;
		console.log(error);
		return <div>Error: {error} </div>;
	}
	const titleRegistryAddress = currentNetworkMapping.TitleRegistry[0];

	// @ts-ignore
	const { runContractFunction } = useWeb3Contract();

	async function approveAndList(data: FormDataReturned) {
		console.log('Aprovando...');
		const titleAddress = data.data[0]?.inputResult;
		const tokenId = data.data[1]?.inputResult;
		const price = ethers.utils
			.parseUnits(data.data[2]?.inputResult.toString()!, 'ether')
			.toString();

		const approveOptions = {
			abi: titleAbi,
			contractAddress: titleAddress?.toString(),
			functionName: 'approve',
			params: {
				to: titleRegistryAddress,
				tokenId: tokenId,
			},
		};

		await runContractFunction({
			params: approveOptions,
			onSuccess: (tx) =>
				handleApproveSuccess(
					tx,
					titleAddress?.toString()!,
					parseInt(tokenId?.toString()!),
					parseInt(price?.toString()!)
				),
			onError: (error) => {
				console.log(error);
			},
		});
	}

	async function handleApproveSuccess(
		tx: any,
		titleAddress: string,
		tokenId: number,
		price: number
	) {
		console.log('Ok!');
		await tx.wait();

		const listOptions = {
			abi: titleRegistryAbi,
			contractAddress: titleRegistryAddress,
			functionName: 'listTitle',
			params: {
				titleAddress: titleAddress,
				tokenId: tokenId,
				price: price,
			},
		};

		await runContractFunction({
			params: listOptions,
			onSuccess: () => handleListSuccess(),
			onError: (error) => console.log(error),
		});
	}

	async function handleListSuccess() {
		dispatch({
			type: 'success',
			message: 'Titulo listado',
			title: 'Titulo listado',
			position: 'topR',
		});
	}

	async function handleWithdrawSuccess() {
		dispatch({
			type: 'success',
			message: 'Retirar fondos',
			position: 'topR',
		});
	}

	async function setupUI() {
		const returnedProceeds = await runContractFunction({
			params: {
				abi: titleRegistryAbi,
				contractAddress: titleRegistryAddress,
				functionName: 'getProceeds',
				params: {
					seller: account,
				},
			},
			onError: (error) => console.log(error),
		});

		if (returnedProceeds) {
			setProceeds(returnedProceeds.toString());
		}
	}

	useEffect(() => {
		setupUI();
	}, [proceeds, account, isWeb3Enabled, chainId as chainType]);

	return (
		<div className='p-1'>
			<Form
				onSubmit={approveAndList}
				data={[
					{
						name: 'Dirección (ethereum)',
						type: 'text',
						inputWidth: '50%',
						value: '',
						key: 'titleAddress',
					},
					{
						name: 'Token ID',
						type: 'number',
						value: '',
						key: 'tokenId',
					},
					{
						name: 'Precio (ETH)',
						type: 'number',
						value: '',
						key: 'price',
					},
				]}
				title='Pon en venta tu propiedad'
				id='Main Form'
			/>
			<div> Retirar {proceeds} proceeds</div>
			{proceeds != '0' ? (
				<Button
					onClick={() => {
						runContractFunction({
							params: {
								abi: titleRegistryAbi,
								contractAddress: titleRegistryAddress,
								functionName: 'withdrawProceeds',
								params: {},
							},
							onError: (error) => console.log(error),
							onSuccess: () => handleWithdrawSuccess,
						});
					}}
					text='Retirar'
					type='button'
				/>
			) : (
				<div>No tienes fondos que retirar</div>
			)}
		</div>
	);
};

export default Home;
