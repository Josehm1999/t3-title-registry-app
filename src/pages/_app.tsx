import '../styles/globals.css';
import type { AppType } from 'next/dist/shared/lib/utils';
import { MoralisProvider } from 'react-moralis';
import Header from '../components/Header';

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<MoralisProvider initializeOnMount={false}>
            <Header />
			<Component {...pageProps} />;
		</MoralisProvider>
	);
};

export default MyApp;
