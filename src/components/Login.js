import React, { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { login } from '../data/ApiService';
import Button from './Button';
import Mensagem from './Mensagem';
import SocialLogin from './SocialLogin';

const Login = () => {
	const navigate = useNavigate()
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState(''); 
	const [mensagem, setMensagem] = useState(''); 

	const handleSubmit = async event => {
		event.preventDefault();

		if (email && senha) {
			const result = await login({email, senha, loginSocial: false})
			let parsed
			let json
			if (result.ok) {
				parsed = await result.json()
				json = parsed

				const user = {
					token: json.token,
					usuarioId: json.usuarioId,
					tipoUsuario: json.tipoUsuario
				}
				localStorage.setItem("user", JSON.stringify(user))
				if (user.tipoUsuario === 'Administrador') {
					navigate("/relatorios")
				} else {
					navigate("/dashboard")
				}
			} else {
				result.text().then(text => { 
					setMensagem(text)
				})
			}
			
		}
	}

  return (
	<div className="login">
		<h1 className='title'>Login</h1>
		<form
			className="form"
			onSubmit={handleSubmit}
			>
			<label 
				htmlFor="emailField" 
				className="label">
				E-mail
				<input 
					type="text" 
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					id="emailField"
				/>
			</label>
			<label 
				htmlFor="senhaField" 
				className="label">
				Senha
				<input 
					type="password" 
					value={senha}
					onChange={(event) => setSenha(event.target.value)}
					id="senhaField"
				/>
			</label>
			<Mensagem mensagem={mensagem} />
			<div className="buttons">
				<button 
					type="submit" 
					className="button"
					disabled={!email || !senha}
				>
					Logar
				</button>
				{<Link to='/cadastro'>
						<Button buttonClass='button button--green' buttonText='Cadastre-se' />
				</Link>}
			</div>

			<SocialLogin page="login" />
		</form>

		<Outlet />
	</div>
  )
}

export default Login