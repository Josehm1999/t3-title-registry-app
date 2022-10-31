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
	const { chainId } = useMoralis();
	const addresses: contractAddressesInterface = networkMapping;
	const chainString = !!chainId ? parseInt(chainId).toString() : '31337';
	const titleregistryAddress = addresses[chainString]!['TitleRegistry']![0];
	const { loading, error, data: listedTitles } = useQuery(GET_ACTIVE_ITEMS);

	return (
		<>
			<div className=''>Hi!</div>
		</>
	);
};

export default Home;
