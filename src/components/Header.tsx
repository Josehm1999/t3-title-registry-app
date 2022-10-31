import { ConnectButton } from 'web3uikit';
import Link from 'next/link';

export default function Header() {
	return (
		<nav className='flex flex-row items-center justify-between border-b-2 p-5'>
			<h1 className='py-4 px-4 text-3xl font-bold'>
				Sistema de Registro de Títulos de Propiedad
			</h1>
			<div className='flex flex-row items-center'>
				<Link href='/'>
					<a className='mr-4 p-6'>Home</a>
				</Link>
				<Link href='/sell-title'>
					<a className='mr-4 p-6'>Transferencia de título de propiedad</a>
				</Link>
				<ConnectButton moralisAuth={false} />
			</div>
		</nav>
	);
}
