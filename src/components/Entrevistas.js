import React, { useEffect } from 'react'
import { useState } from 'react'
import { getSchedule } from '../data/ApiService'
import EntrevistaDetalhe from './EntrevistaDetalhe';
import EntrevistaFormulario from './EntrevistaFormulario';
import Loader from './Loader';

const Entrevistas = () => {
	const [entrevistas, setEntrevistas] = useState([]);
	const [temEntrevistas, setTemEntrevistas] = useState(false);
	const [title, setTitle] = useState();
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState();
	const [usuario, setUsuario] = useState();

	const updateList = async function() {
		setTemEntrevistas(false)
		setEntrevistas([0])
		await getList(usuario)
	}

	const getList = async function (user) {
		setLoading(true)

		let _entrevistas = localStorage.getItem('entrevistas')
		let resultEntrevistas = []
		if (_entrevistas) {
			resultEntrevistas = JSON.parse(_entrevistas)
		} else {
			resultEntrevistas = await getSchedule(user.usuarioId, user.token)
			localStorage.setItem('entrevistas', JSON.stringify(resultEntrevistas))
		}

		
		if (resultEntrevistas && resultEntrevistas.length > 0) {
			setEntrevistas(resultEntrevistas);
			setTemEntrevistas(true)
			setLoading(false)
		} else {
			const mensagem = 'Você ainda não tem entrevistas marcados'
			setLoading(false)
			setTemEntrevistas(false)
			setEntrevistas([])
			setMessage(mensagem)
		}

		const roleUsuario = user.roleUsuario;
		const titleMsg = roleUsuario === 'Empresa' ? 'Entrevistas da Empresa' : 'Entrevistas do Candidato'
		setTitle(titleMsg)

		return resultEntrevistas
	}

	useEffect(() => {
		async function getUser() {
			const _user = localStorage.getItem("user")
			let user

			if (_user) {
				user = JSON.parse(_user)

				setUsuario(user)
				const result = await getList(user)

				return result
			} else {
				console.log('Erro ao recuperar os dados do usuário.')
				return false
			}
		}
		getUser()
	}, [])

	return (
		<div className="entrevista">
			<h1 className="title">{title}</h1>
			<div className="lista">
				{
					loading ? (
						<Loader />
					) : (
						temEntrevistas ? (
							entrevistas && entrevistas.map((entrevista, index) =>
								<EntrevistaDetalhe key={index} data={entrevista} usuario={usuario} /> 
							)
						) : <p className="message">{message}</p> 
					)
				}
			</div>
		</div>
	)
}

export default Entrevistas