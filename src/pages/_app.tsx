import '../styles/globals.css';
import type { AppType } from 'next/dist/shared/lib/utils';
import { MoralisProvider } from 'react-moralis';
import Header from '../components/Header';
import Head from 'next/head';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { NotificationProvider } from 'web3uikit';

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
