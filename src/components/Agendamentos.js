import React, { useEffect } from 'react'
import { useState } from 'react'
import { getSchedule } from '../data/ApiService'
import AgendamentoDetalhe from './AgendamentoDetalhe';
import AgendamentoFormulario from './AgendamentoFormulario';
import Loader from './Loader';

const Agendamentos = () => {
	const [agendamentos, setAgendamentos] = useState([]);
	const [temAgendamentos, setTemAgendamentos] = useState(false);
	const [title, setTitle] = useState();
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState();
	const [usuario, setUsuario] = useState();

	const updateList = async function() {
		setTemAgendamentos(false)
		setAgendamentos([0])
		await getList(usuario)
	}

	const getList = async function (user) {
		setLoading(true)

		let _agendamentos = localStorage.getItem('agendamentos')
		let resultAgendamentos = []
		if (_agendamentos) {
			resultAgendamentos = JSON.parse(_agendamentos)
		} else {
			resultAgendamentos = await getSchedule(user.usuarioId, user.token)
			localStorage.setItem('agendamentos', JSON.stringify(resultAgendamentos))
		}

		
		if (resultAgendamentos && resultAgendamentos.length > 0) {
			setAgendamentos(resultAgendamentos);
			setTemAgendamentos(true)
			setLoading(false)
		} else {
			const mensagem = 'Você ainda não tem agendamentos marcados'
			setLoading(false)
			setTemAgendamentos(false)
			setAgendamentos([])
			setMessage(mensagem)
		}

		const tipoUsuario = user.tipoUsuario;
		const titleMsg = tipoUsuario === 'Empresa' ? 'Agendamentos da Empresa' : 'Agendamentos do Candidato'
		setTitle(titleMsg)

		return resultAgendamentos
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
		<div className="agendamento">
			<h1 className="title">{title}</h1>
			<div className="lista">
				{
					loading ? (
						<Loader />
					) : (
						temAgendamentos ? (
							agendamentos && agendamentos.map((agendamento, index) =>
								<AgendamentoDetalhe key={index} data={agendamento} /> 
							)
						) : <p className="message">{message}</p> 
					)
				}
				<AgendamentoFormulario 
					edit={false} 
					callback={(e) => updateList(e)} />
			</div>
		</div>
	)
}

export default Agendamentos