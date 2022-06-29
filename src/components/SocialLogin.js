import React from 'react'
import { useEffect } from 'react'
import jwt_decode from 'jwt-decode'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../data/ApiService'

const SocialLogin = ({page}) => {

	const [loginSocial, setLoginSocial] = useState({})
	const [token, setToken] = useState({})
	const [message, setMessage] = useState('')
	const navigation = useNavigate()

	async function handleCallbackResponse(response) {
		const decoded = jwt_decode(response.credential);
		setToken(decoded)
		setLoginSocial(decoded)

		const email = decoded.email

		if (page === 'login') {
			const result = await login({email, senha: null, loginSocial: true})
			if (result.status == 200) {
				const json =  await result.json();
				const user = {
					token: json.token,
					usuarioId: json.usuarioId,
					tipoUsuario: json.tipoUsuario,
					loginSocialToken: decoded
				}
	
				localStorage.setItem("user", JSON.stringify(user))
				window.dispatchEvent( new Event('storage') ) 
				document.getElementById('signIn').hidden = true;
				setMessage('')
				
				if (page === 'login') {
					navigation("/perfil")
				}
			} else if (result.status === 404) {
				setMessage('Você ainda não se cadastrou.')
				localStorage.setItem('user', null)
				window.dispatchEvent( new Event('storage') ) 
				
				setLoginSocial({});
				document.getElementById('signIn').hidden = false;
			} else {
				localStorage.setItem('user', null)
				window.dispatchEvent( new Event('storage') ) 
				
				setLoginSocial({});
				document.getElementById('signIn').hidden = false;
			}
		} else {
			const user = {
				token: null,
				usuarioId: null,
				tipoUsuario: null,
				loginSocialToken: decoded
			}
	
			localStorage.setItem("user", JSON.stringify(user))
			window.dispatchEvent( new Event('storage') ) 
			document.getElementById('signIn').hidden = true;
			setMessage('')
			
			if (page === 'login') {
				navigation("/perfil")
			}
		}
	
	}

	function handleSignOut(event) {
		localStorage.setItem('user', null)
		window.dispatchEvent( new Event('storage') ) 
		setLoginSocial({});
		setMessage('')
		document.getElementById('signIn').hidden = false;
		
		if (page === 'login') {
			navigation("/login")
		}
	}

	useEffect(() => {
		
		const user = localStorage.getItem('user')
		if (!user)
			localStorage.setItem('user', null)

		window.dispatchEvent( new Event('storage') ) 
		
		/* global google */
		google.accounts.id.initialize({
			client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
			callback: handleCallbackResponse
		})

		google.accounts.id.renderButton(
			document.getElementById('signIn'),
			{theme: 'outline', size: 'large'}
		)
	}, [])

	return (
		<div className="login-social">
			<p className="login-social__message">{message}</p>
			<div id='signIn'></div>
			{Object.keys(loginSocial).length != 0 &&
				<button
					id='signOut'
					className='button button--grey'
					onClick={(e) => handleSignOut(e)}
				>Sign Out</button>
			}
		</div>
	)
}

export default SocialLogin