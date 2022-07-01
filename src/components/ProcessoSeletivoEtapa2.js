import React, { useEffect, useState } from 'react'
import { deleteSchedule, getCSVExport, getScheduleBySelectionProcess } from '../data/ApiService';
import Loader from './Loader';
import AgendamentoFormulario from './AgendamentoFormulario'

const ProcessoSeletivoEtapa2 = () => {

	const [candidaturas, setCandidaturas] = useState([]);
	const [usuario, setUsuario] = useState('');
	const [message, setMessage] = useState();
	const [temAgendamentos, setTemAgendamentos] = useState(false);
	const [loading, setLoading] = useState(false);
	const [processoSeletivoData, setProcessoSeletivoData] = useState()
	const [agendamentos, setAgendamentos] = useState(false);
	const [edit, setEdit] = useState(false)
	const [editData, setEditData] = useState([])

	const updateList = async function () {
		setTemAgendamentos(false)
		setAgendamentos([])
		setEdit(false)
		setEditData([])
		await getList(usuario)
	}

	const getList = async function (user) {
		setUsuario(user)
		setLoading(true)

		let resultAgendamentos = []
		const _processoSeletivo = localStorage.getItem("processoSeletivoData")
		let resultProcessoSeletivo = []
		if (_processoSeletivo) {
			resultProcessoSeletivo = JSON.parse(_processoSeletivo)
			setProcessoSeletivoData(resultProcessoSeletivo)

			resultAgendamentos = await getScheduleBySelectionProcess(resultProcessoSeletivo.processoseletivoid, user.token)
		}

		setUsuario({
			usuarioId: user.usuarioId,
			tipoUsuario: user.tipoUsuario,
			token: user.token
		})

		if (resultAgendamentos && Object.keys(resultAgendamentos).length > 0) {
			setAgendamentos(resultAgendamentos);
			setTemAgendamentos(true);
			setLoading(false)
		} else {
			setAgendamentos([])
			setTemAgendamentos(false);
			const mensagem = 'Não há agendamentos para esse processo seletivo.'
			setMessage(mensagem)
			setLoading(false)
		}

		return resultAgendamentos
	}

	useEffect(() => {
		async function getUser() {
			const _user = localStorage.getItem("user")
			let user

			if (_user) {
				user = JSON.parse(_user)

				const result = await getList(user)

				return result
			} else {
				console.log('Erro ao recuperar os dados do usuário.')
				return false
			}
		}
		getUser()
	}, [])

	const handleDelete = async function (agendamento) {
		const result = await deleteSchedule(agendamento.agendamentoid, usuario.token)
		updateList()
	}

	const handleEdit = function (agendamento) {
		setEdit(true)
		const data = {
			motivo: agendamento.motivo,
			dia: agendamento.dia,
			hora: agendamento.hora,
			localizacao: agendamento.localizacao,
			candidatoSelecionadoId: agendamento.candidatoselecionadoid,
			nomeCandidato: agendamento.nomecandidato,
			processoSeletivoId: agendamento.processoseletivoid,
			agendamentoId: agendamento.agendamentoid
		}
		setEditData(data)
	}

	const handleExport = async function (item) {
		const filename = `agendamentos-${item.agendamentoid}.csv`
		const result = await getCSVExport('agendamentos', item.agendamentoid, filename, usuario.token)
	}

	return (
		<div className="etapa2">
			<h1 className="title">Processo Seletivo</h1>
			<h2 className="subtitle subtitle-etapa">ETAPA 2: Agendamentos</h2>

			<AgendamentoFormulario edit={edit} callback={updateList} data={processoSeletivoData} usuario={usuario} />
			<div className="lista">
				{
					loading ? (
						<Loader />
					) : (
						temAgendamentos ? (
							agendamentos.map((item, index) =>
								<div key={index} className='detalhes-agendamento'>
									<div className="detalhes">
										<div className="detalhe-item">
											<p className="detalhe-item__label">Motivo</p>
											<p className="detalhe-item__value">{item.motivo}</p>
										</div>
										<div className="detalhe-item">
											<p className="detalhe-item__label">Dia</p>
											<p className="detalhe-item__value">{item.dia}</p>
										</div>
										<div className="detalhe-item">
											<p className="detalhe-item__label">Hora</p>
											<p className="detalhe-item__value">{item.hora}</p>
										</div>
										<div className="detalhe-item">
											<p className="detalhe-item__label">Localização</p>
											<p className="detalhe-item__value">{item.localizacao}</p>
										</div>
										<div className="detalhe-item">
											<p className="detalhe-item__label">Candidato Selecionado</p>
											<p className="detalhe-item__value">{item.nomeCandidato}</p>
										</div>
									</div>
									<div className="buttons">
										<button 
											onClick={handleExport.bind(this, item)}
											className="button button--blue">
												Exportar CSV
										</button>
										<button 
											onClick={handleEdit.bind(this, item)}
											className="button button--yellow">
												Editar
										</button>
										<button 
											onClick={handleDelete.bind(this, item)}
											className="button button--red">
												Delete
										</button>
									</div>
									{
										edit ? (
											<AgendamentoFormulario edit={edit} callback={updateList} data={editData} usuario={usuario} />
										) : ''
									}
								</div>
							)
						) : <p className="mensagem">{message}</p>
					)
				}
			</div>
		</div>
  )
}

export default ProcessoSeletivoEtapa2