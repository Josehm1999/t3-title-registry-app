import '../styles/globals.css';
import type { AppType } from 'next/dist/shared/lib/utils';
import { MoralisProvider} from 'react-moralis';
import Header from '../components/Header';
import Head from 'next/head';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
	cache: new InMemoryCache(),
	uri: 'https://api.studio.thegraph.com/query/37294/title-registry-app/v0.0.2',
});

const MyApp: AppType = ({ Component, pageProps }) => {

    return (
		<div>
			<Head>
				<title>Title Registry App</title>
				<meta name='description' content='Title Registry App' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<MoralisProvider initializeOnMount={false}>
				<ApolloProvider client={client}>
					<Header />
					<Component {...pageProps} />
				</ApolloProvider>
			</MoralisProvider>
		</div>
	);
};

export default MyApp;
