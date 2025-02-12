import React, { useEffect, useState } from 'react'
import { deleteSchedule, getCSVExport, getScheduleBySelectionProcess } from '../data/ApiService';
import Loader from './Loader';
import EntrevistaFormulario from './EntrevistaFormulario'
import { Link } from 'react-router-dom';

const ProcessoSeletivoEtapa2 = () => {

	const [candidaturas, setCandidaturas] = useState([]);
	const [usuario, setUsuario] = useState('');
	const [message, setMessage] = useState();
	const [temEntrevistas, setTemEntrevistas] = useState(false);
	const [loading, setLoading] = useState(false);
	const [processoSeletivoData, setProcessoSeletivoData] = useState()
	const [entrevistas, setEntrevistas] = useState(false);
	const [edit, setEdit] = useState(false)
	const [editData, setEditData] = useState([])

	const updateList = async function () {
		setTemEntrevistas(false)
		setEntrevistas([])
		setEdit(false)
		setEditData([])
		await getList(usuario)
	}

	const getList = async function (user) {
		setUsuario(user)
		setLoading(true)

		let resultEntrevistas = []
		const _processoSeletivo = localStorage.getItem("processoSeletivoData")
		let resultProcessoSeletivo = []
		if (_processoSeletivo) {
			resultProcessoSeletivo = JSON.parse(_processoSeletivo)
			setProcessoSeletivoData(resultProcessoSeletivo)

			resultEntrevistas = await getScheduleBySelectionProcess(resultProcessoSeletivo.processoseletivoid, user.token)
		}

		setUsuario({
			usuarioId: user.usuarioId,
			roleUsuario: user.roleUsuario,
			token: user.token
		})

		if (resultEntrevistas && Object.keys(resultEntrevistas).length > 0) {
			setEntrevistas(resultEntrevistas);
			setTemEntrevistas(true);
			setLoading(false)
		} else {
			setEntrevistas([])
			setTemEntrevistas(false);
			const mensagem = 'Não há entrevistas para esse processo seletivo.'
			setMessage(mensagem)
			setLoading(false)
		}

		return resultEntrevistas
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

	const handleDelete = async function (entrevista) {
		const result = await deleteSchedule(entrevista.entrevistaid, usuario.token)
		updateList()
	}

	const handleEdit = function (entrevista) {
		setEdit(true)
		const data = {
			motivo: entrevista.motivo,
			dia: entrevista.dia,
			hora: entrevista.hora,
			localizacao: entrevista.localizacao,
			candidatoSelecionadoId: entrevista.candidatoselecionadoid,
			nomeCandidato: entrevista.nomecandidato,
			processoSeletivoId: entrevista.processoseletivoid,
			entrevistaId: entrevista.entrevistaid
		}
		setEditData(data)
	}

	const handleExport = async function (item) {
		const filename = `entrevistas-${item.entrevistaid}.csv`
		const result = await getCSVExport('entrevistas', item.entrevistaid, filename, usuario.token)
	}

	return (
		<div className="etapa2">
			<div className="buttons">
				<Link 
					className='detalhe-item__link'
					to='/processos-seletivos/etapa-1'>
					<button
						className="button button--grey"
						>Voltar para Processos Seletivos Etapa 1</button>
				</Link>
			</div>
			<h1 className="title">Processo Seletivo</h1>
			<h2 className="subtitle subtitle-etapa">ETAPA 2: Entrevistas</h2>

			<EntrevistaFormulario edit={edit} callback={updateList} data={processoSeletivoData} usuario={usuario} />
			<div className="lista">
				{
					loading ? (
						<Loader />
					) : (
						temEntrevistas ? (
							entrevistas.map((item, index) =>
								<div key={index} className='detalhes-entrevista'>
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
											type="button"
											onClick={handleExport.bind(this, item)}
											className="button button--blue">
												Exportar CSV
										</button>
										<button 
											type="button"
											onClick={handleEdit.bind(this, item)}
											className="button button--yellow">
												Editar
										</button>
										<button 
											type="button"
											onClick={handleDelete.bind(this, item)}
											className="button button--red">
												Delete
										</button>
									</div>
									{
										edit ? (
											<EntrevistaFormulario edit={edit} callback={updateList} data={editData} usuario={usuario} />
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