import type { NextPage } from 'next';
import { useMoralis } from 'react-moralis';
import networkMapping from '../../constants/networkMapping.json';
import GET_ACTIVE_ITEMS from '../../constants/subgraphQueries';
import { useQuery } from '@apollo/client';
import NFTBox from '../components/NFTBox';

interface titleInterface {
	price: number;
	titleAddress: string;
	tokenId: string;
	address: string;
	seller: string;
}

interface contractAddressesInterface {
	[key: string]: contractAddressesTitleInterface;
}

interface contractAddressesTitleInterface {
	[key: string]: string[];
}

const Home: NextPage = () => {
	const { isWeb3Enabled, chainId } = useMoralis();
	const addresses: contractAddressesInterface = networkMapping;
	const chainString = !!chainId ? parseInt(chainId).toString() : '1337';
	const titleregistryAddress = addresses[chainString]!['TitleRegistry']![0];
    console.log(titleregistryAddress);
	const {
		loading,
		error: subgraphQueryError,
		data: listedTitles,
	} = useQuery(GET_ACTIVE_ITEMS);

	return (
		<div className='container mx-auto'>
			<h1 className='py-4 px-4 text-2xl font-bold'>Listados recientemente</h1>
			<div className='flex flex-wrap'>
				{isWeb3Enabled ? (
					loading || !listedTitles ? (
						<div>Cargando...</div>
					) : (
						listedTitles.activeTitles.map((title: titleInterface) => {
							const { price, titleAddress, tokenId, address, seller } = title;
							return (
								<div>
									<NFTBox
										price={price}
										titleAddress={titleAddress}
										tokenId={tokenId}
										address={titleregistryAddress!}
										seller={seller}
										key={`${titleAddress}${tokenId}`}
									/>
								</div>
							);
						})
					)
				) : (
					<div> Web3 no esta habilitado</div>
				)}
			</div>
		</div>
	);
};

export default Home;
