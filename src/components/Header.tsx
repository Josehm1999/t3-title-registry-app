import { ConnectButton } from 'web3uikit';
import Link from 'next/link';

export default function Header() {
	return (
		<nav>
			<h1 className='py-4 px-4 text-3xl font-bold'>
				Sistema de Registro de Títulos de Propiedad
			</h1>
			<div>
				<Link href='/'>
					<a>Sistema de Registro de Títulos de Propiedad</a>
				</Link>
				<Link href='/sell-title'>
					<a>Transferencia de título de propiedad</a>
				</Link>
				<ConnectButton />
			</div>
		</nav>
	);
}
