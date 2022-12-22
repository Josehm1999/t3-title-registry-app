import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import titleRegistryAbi from '../../constants/TitleRegistry.json';
import titleAbi from '../../constants/BasicNft.json';
import Image from 'next/image';
import { Card, useNotification } from 'web3uikit';
import { ethers } from 'ethers';
import { UpdateListingModale } from './UpdateListingModal';

interface NFTBoxProps {
	price?: number;
	titleAddress: string;
	tokenId: string;
	address: string;
	seller?: string;
}

//Funcion que formatea la dirección (address) para que quepa
//dentro de la tarjeta de diseño
const truncateStr = (fullStr: string, strLength: number) => {
	if (fullStr.length <= strLength) return fullStr;

	const separator = '...';
	const separatorLength = separator.length;
	const charsToShow = strLength - separatorLength;
	const frontChars = Math.ceil(charsToShow / 2);
	const backChars = Math.floor(charsToShow / 2);
	return (
		fullStr.substring(0, frontChars) +
		separator +
		fullStr.substring(fullStr.length - backChars)
	);
};

const NFTBox: NextPage<NFTBoxProps> = ({
	price,
	titleAddress,
	tokenId,
	address,
	seller,
}: NFTBoxProps) => {
	const { chainId, isWeb3Enabled, account } = useMoralis();
	const [imageURI, setImageURI] = useState('');
	const [tokenName, setTokenName] = useState('');
	const [tokenDescription, setTokenDescription] = useState('');
	const dispatch = useNotification();

	/*State para manejar la visibilidad de los modal para crear
     o actualizar titulos */
	const [showModal, setShowModal] = useState(false);
	const hideModal = () => setShowModal(false);
	const isListed = seller !== undefined;

	const { runContractFunction: getTokenURI } = useWeb3Contract({
		abi: titleAbi,
		contractAddress: titleAddress,
		functionName: 'tokenURI',
		params: {
			tokenId: tokenId,
		},
	});

	const { runContractFunction: buyTitle, error:buyError } = useWeb3Contract({
		abi: titleRegistryAbi,
		contractAddress: address,
		functionName: 'buyTitle',
		msgValue: price,
		params: {
			titleAddress: titleAddress,
			tokenId: tokenId,
		},
	});

	async function updateUI() {
		const tokenURI = await getTokenURI();

		if (tokenURI) {
			// IPFS Gateway: Un servidor que retornara archivos IPFS desde un una URL que use https
			const requestURL = (tokenURI as string).replace(
				'ipfs://',
				'https://ipfs.io/ipfs/'
			);
			const tokenURIResponse = await (await fetch(requestURL)).json();
			const imageURI = tokenURIResponse.image;
			const imageURIURL = (imageURI as string).replace(
				'ipfs://',
				'https://ipfs.io/ipfs/'
			);
			setImageURI(imageURIURL);
			setTokenName(tokenURIResponse.name);
			setTokenDescription(tokenURIResponse.description);
		}
	}

	useEffect(() => {
		if (isWeb3Enabled) {
			updateUI();
		}
	}, [isWeb3Enabled]);

	const isOwnedByUser = seller === account || seller === undefined;
	const formattedSellerAddress = isOwnedByUser
		? 'Te pertenece'
		: `Propiedad de ${truncateStr(seller || '', 15)}`;

	const handleCardClick = () => {
		isOwnedByUser
			? setShowModal(true) //show the modal : buyTitle
			: buyTitle({
					onError: (error) => console.log(error),
					onSuccess: () => handleBuyItemSuccess(),
			  });
	};

	const handleBuyItemSuccess = () => {
		dispatch({
			type: 'success',
			message: 'Propiedad comprada',
			title: 'Propiedad comprada',
			position: 'topR',
		});
	};
	return (
		<div>
			{imageURI ? (
				<div>
					<UpdateListingModale
						isVisible={showModal}
						tokenId={tokenId}
						titleAddress={titleAddress}
						onClose={hideModal}
						address={address}
					/>
					<Card
						title={tokenName}
						description={tokenDescription}
						onClick={handleCardClick}
					>
						<div className='p-2'>
							<div className='flex flex-col items-end gap-2'>
								<div>#{tokenId}</div>
								<div className='text-sm italic'>{formattedSellerAddress}</div>
								<Image
									loader={() => imageURI}
									src={imageURI}
									height='200'
									width='200'
								/>
								<div className='font-bold'>
									{ethers.utils.formatUnits(price!, 'ether')} ETH
								</div>
							</div>
						</div>
					</Card>
				</div>
			) : (
				<div> Cargando.... </div>
			)}
		</div>
	);
};

export default NFTBox;
