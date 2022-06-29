import Logo from './Logo';
import Nav from './../components/Nav';
import { useEffect, useState } from 'react';

const Header = () => {
	const [onScroll, setOnScroll] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', () =>
				setOnScroll(window.pageYOffset > 0)
			);
		}
	}, []);

	return (
		<header id='header' className={`header ${onScroll ? 'on-scroll' : ''}`}>
			<div id='overlay'></div>
			<Logo />
			<Nav />
		</header>
	)
}

export default Header