import React, { useEffect, useState } from 'react'
import { getAllApplicationsByVacancy, getSelectedCandidates } from '../data/ApiService';
import Candidaturas from './Candidaturas';
import Loader from './Loader';
import { Link } from 'react-router-dom';

const ProcessoSeletivoEtapa1 = () => {
	const [candidaturas, setCandidaturas] = useState([]);
	const [usuario, setUsuario] = useState('');
	const [message, setMessage] = useState();
	const [temCandidaturas, setTemCandidaturas] = useState(false);
	const [loading, setLoading] = useState(false);
	const [processoSeletivoData, setProcessoSeletivoData] = useState()
	const [candidatosSelecionados, setCandidatosSelecionados] = useState([]);

	const updateList = async function () {
		setTemCandidaturas(false)
		setCandidaturas([])
		localStorage.removeItem('candidaturas')
		setCandidatosSelecionados([])
		await getList(usuario)
	}

	const getList = async function (user) {
		setUsuario(user)
		setLoading(true)

		let resultCandidaturas = []
		const _processoSeletivo = localStorage.getItem("processoSeletivoData")
		let resultProcessoSeletivo = []
		if (_processoSeletivo) {
			resultProcessoSeletivo = JSON.parse(_processoSeletivo)
			setProcessoSeletivoData(resultProcessoSeletivo)

			resultCandidaturas = await getAllApplicationsByVacancy(resultProcessoSeletivo.vagaid, user.token)
			localStorage.setItem('candidaturas', JSON.stringify(resultCandidaturas))

			const resultSelectedCandidates = await getSelectedCandidates(resultProcessoSeletivo.processoseletivoid, user.token)
			localStorage.setItem('candidatosSelecionados', JSON.stringify(resultSelectedCandidates))
            console.log("🚀 ~ file: ProcessoSeletivoEtapa1.js ~ line 37 ~ getList ~ resultSelectedCandidates", resultSelectedCandidates)
			setCandidatosSelecionados(resultSelectedCandidates)

		}

		setUsuario({
			usuarioId: user.usuarioId,
			tipoUsuario: user.tipoUsuario,
			token: user.token
		})

		if (resultCandidaturas && Object.keys(resultCandidaturas).length > 0) {
			setCandidaturas(resultCandidaturas);
			setTemCandidaturas(true);
			setLoading(false)
		} else {
			setCandidaturas([])
			setTemCandidaturas(false);
			const mensagem = 'Não há candidaturas para essa vaga.'
			setMessage(mensagem)
			setLoading(false)
		}

		const tipoUsuario = user.tipoUsuario;
		return resultCandidaturas
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

	return (
		<div className="etapa1">
			<Link 
				className='detalhe-item__link'
				to='/processos-seletivos'>
				<button
					className="button button--grey"
					>Voltar para Processos Seletivos</button>
			</Link>
			<h1 className="title">Processo Seletivo</h1>
			<h2 className="subtitle subtitle-etapa">ETAPA 1: Seleção de Candidatos</h2>

			<div className="lista">
				{
					loading ? (
						<Loader />
					) : (
						temCandidaturas && (
								candidaturas && candidaturas.length > 0
							) ? (
								<>
									<div className="candidatos-selecionados">
										<h2 className="subtitle">Candidatos Selecionados</h2>
										{
											candidatosSelecionados && candidatosSelecionados.length > 0 ? (
												candidatosSelecionados.map((item, index) =>
													<div key={index} className="lista">
														<p className="detalhe-item__label">Nome do Candidato: </p>
														<p className="detalhe-item__value">{item.nomecompleto}</p>
													</div>
												)
											) : <p className="mensagem">Não há candidatos selecionados</p>
										}
									</div>
									<Candidaturas callback={updateList} candidaturasData={candidaturas} usuario={usuario} processoSeletivoData={processoSeletivoData} />
									<Link 
										className='detalhe-item__link'
										to='/processos-seletivos/etapa-2'>
										<button
											className="button button--purple"
											>Próxima Etapa</button>
									</Link>
								</>
						) : <p className="mensagem">{message}</p>
					)
				}
			</div>
		</div>
	)
}

export default ProcessoSeletivoEtapa1