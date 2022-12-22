import '../styles/globals.css';
import type { AppType } from 'next/dist/shared/lib/utils';
import { MoralisProvider } from 'react-moralis';
import Header from '../components/Header';
import Head from 'next/head';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { NotificationProvider } from 'web3uikit';
import { env } from '../env/client.mjs';

const client = new ApolloClient({
	cache: new InMemoryCache(),
	uri: env.NEXT_PUBLIC_GRAPH_LOCAL_NODE,
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
					<NotificationProvider>
						<Header />
						<Component {...pageProps} />
					</NotificationProvider>
				</ApolloProvider>
			</MoralisProvider>
		</div>
	);
};

export default MyApp;
