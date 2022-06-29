import { Link, useLocation, useNavigate } from 'react-router-dom';
import {navigationItems} from "../config"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';

const Nav = () => {
	const useAuth = () => {
		const user = localStorage.getItem("user")
		if (user) {
			const _user = JSON.parse(user)
			return _user
		} else {
			return false
		}
	}
	const user = useAuth()
	const location = useLocation()
	const navigation = useNavigate()
	const [exibeMenuMobile, setExibeMenuMobile] = useState(false)

	const clearLocalStorage = function (itemName) {
		const items = { ...localStorage };
        
		if (items && Object.keys(items).length > 0) {
			Object.entries(items).forEach(([key, value]) => {
				localStorage.removeItem(key)
			})
		}
	}
	
	const logout = () => {
		localStorage.removeItem("user")
		clearLocalStorage()
		navigation("/login")
	}
	
	const toggleMenu = function () {
		if (exibeMenuMobile) {
			document.getElementById('overlay').style.left = '-100%'
		} else {
			document.getElementById('overlay').style.left = '0'
		}
		setExibeMenuMobile(!exibeMenuMobile)
	}

	return (
		<>
			<nav id="navigation" className={`nav ${exibeMenuMobile ? 'active' : ''}`}>
				<a 
					onClick={toggleMenu}
					className="menu">
					<FontAwesomeIcon icon={faBars} />
				</a>
				<ul className={`nav-list ${exibeMenuMobile ? 'show' : ''}`}>
					{user && (
						<>
							{
								user.tipoUsuario === 'Administrador' ? (
									navigationItems.menuLogado.map((item) => (	
										(item.role === user.tipoUsuario) ? (
											<li key={item.text} className="nav-item">
												<Link
													onClick={toggleMenu} 
													to={item.to}>
													{item.name}
												</Link>
											</li>
										) : ''
									))
								) : (
									navigationItems.menuLogado.map((item) => (	
										!item.role || (item.role === user.tipoUsuario) ? (
											<li key={item.text} className="nav-item">
												<Link
													onClick={toggleMenu} 
													to={item.to}>
													{item.name}
												</Link>
											</li>
										) : ''
									))
								)
							}
							{}
							<li className="nav-item">
								{location.pathname !== "/login" && (
									<a onClick={logout}>Logout</a>
								)}
							</li>
						</>
					)}
					{!user && (
						<>
							{navigationItems.menuDeslogado.map((item) => (
								<li  key={item.text} className="nav-item">
									<Link
										onClick={toggleMenu}  
										to={item.to}>
										{item.name}
									</Link>
								</li>
							))}
						</>
					)}
				</ul>
			</nav>
		</>
	)
}

export default Nav;