import type { NextPage } from 'next';
import { useMoralis } from 'react-moralis';
import networkMapping from '../../constants/networkMapping.json';
import GET_ACTIVE_ITEMS from '../../constants/subgraphQueries';
import { useQuery } from '@apollo/client';

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
	const chainString = !!chainId ? parseInt(chainId).toString() : '31337';
	const titleregistryAddress = addresses[chainString]!['TitleRegistry']![0];
	const {
		loading,
		error: subgraphQueryError,
		data: listedTitles,
	} = useQuery(GET_ACTIVE_ITEMS);

	return (
		<div className='container mx-auto'>
			<h1 className='py-4 px-4 text-2xl font-bold'>Listados recientemente</h1>
			<div className='flex flex-wrap'>
				{loading || !listedTitles ? (
					<div>Cargando...</div>
				) : (
					listedTitles.activeTitles.map((title: titleInterface) => {
						const { price, titleAddress, tokenId, seller } = title;
						console.log(titleregistryAddress);
						return <div></div>;
					})
				)}
				;
			</div>
		</div>
	);
};

export default Home;
