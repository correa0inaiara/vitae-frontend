import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import CadastroCandidato from './CadastroCandidato';
import CadastroEmpresa from './CadastroEmpresa';
import SocialLogin from './SocialLogin';

const redirect = function (event, navigate) {
	navigate("/dashboard")
}

const Cadastro = () => {
	const navigate = useNavigate()
	const [tipoUsuario, setTipoUsuario] = useState('Empresa');

	return (
		<div className="cadastro">
			<h1 className='title'>Cadastre-se</h1>
			<h2 className="cadastro-subtitle">Você pode escolher entre se cadastrar através de e-mail e senha ou, alternativamente, você pode se cadastrar com o OAuth do Google e quando for logar não precisará de senha.</h2>

			<SocialLogin page="cadastro" />

			<div className="toggle-tipo-usuario">
				<a
					className={`toggle-item ${tipoUsuario === 'Empresa' ? 'active' : ''}`}
					onClick={() => setTipoUsuario('Empresa')}
				>Sou uma Empresa</a>
				<hr />
				<a
					className={`toggle-item ${tipoUsuario === 'Candidato' ? 'active' : ''}`}
					onClick={() => setTipoUsuario('Candidato')}
				>Sou um (a) Candidato (a)</a>
			</div>

			{tipoUsuario === 'Empresa' ?
				<CadastroEmpresa redirect={redirect.bind(this, navigate)} /> :
				<CadastroCandidato redirect={redirect.bind(this, navigate)} />}

		</div>
	)
}

export default Cadastro