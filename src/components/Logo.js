import { Link } from 'react-router-dom';
import LogoImage from './../assets/logo.svg';

const Logo = () => {
	return (
		<div className="logo">
			<Link to='/'>
				<img src={LogoImage} alt="Logo: Vitae - Vagas e Currículos" className="logo-img" />
			</Link>
		</div>
	)
}

export default Logo