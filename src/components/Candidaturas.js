import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { Link } from 'react-router-dom';
import { getSelectedCandidates, registerSelectedCandidate } from '../data/ApiService';

const Candidaturas = ({ callback, candidaturasData, usuario, processoSeletivoData }) => {

	const [candidaturas, setCandidaturas] = useState(candidaturasData)
	const [candidatosSelecionados, setCandidatosSelecionados] = useState(candidaturasData)
	const [candidatoSelecionado, setCandidatoSelecionado] = useState({selecionado: false, candidaturaId: ''})
	const [processoSeletivo, setProcessoSeletivo] = useState(processoSeletivoData)
	const [message, setMessage] = useState('Não há candidaturas para esta vaga');

	useEffect(() => {
		async function getSelectedCandidatesForApplications() {
			const candidatosSelecionados = await getSelectedCandidates(processoSeletivo.processoseletivoid, usuario.token)
            console.log("🚀 ~ file: Candidaturas.js ~ line 18 ~ getSelectedCandidatesForApplications ~ candidatosSelecionados", candidatosSelecionados)
			setCandidatosSelecionados(candidatosSelecionados)

		}
		getSelectedCandidatesForApplications()
	}, [])
	

	const handleSelectCandidate = async function (candidaturaId) {
		const result = await registerSelectedCandidate(candidaturaId, processoSeletivo.processoseletivoid, usuario.token)

		const resultCandidatura = checkSelection(candidaturaId)

		if (resultCandidatura) {
			const candidatoSelecionado = {
				selecionado: true,
				candidaturaId
			}
			setCandidatoSelecionado(candidatoSelecionado)
		}

		callback()
	}

	const checkSelection = async function (candidaturaId) {

		const candidatosSelecionados = await getSelectedCandidates(processoSeletivo.processoseletivoid, usuario.token)
		setCandidatosSelecionados(candidatosSelecionados)

		let result = false
		if (candidatosSelecionados && candidatoSelecionado.length > 0) {
			result = candidatosSelecionados.find(item => item.candidatoselecionadoid === candidaturaId)
			// result = result ? true : false
		}

        console.log("🚀 ~ file: Candidaturas.js ~ line 46 ~ checkSelection ~ result", result)
		return result
	}
	
	return (
		<div className="candidaturas">
			<div className="buttons">
				<Link 
					className='detalhe-item__link'
					to='/processos-seletivos'>
					<button
						className="button button--grey"
						>Voltar para os Processos Seletivos</button>
				</Link>
			</div>
			<h1 className="title">Candidaturas</h1>
			<div className="lista">
			{
				candidaturas && candidaturas.length > 0 ? (
					candidaturas.map((item, index) => 
						<div key={index} className="detalhes-candidatura detalhes-candidatura--border">
							<p className="detalhe-item__label">Nome do Candidato:</p>
							<p className="detalhe-item__value">{item.candidato.nomecompleto}</p>
							<div className="buttons">
								{
									candidatoSelecionado.selecionado && candidatoSelecionado.candidaturaId === item.candidaturaid ? 'Candidato já selecionado' : <button
									onClick={handleSelectCandidate.bind(this, item.candidaturaid)}
									className="button button--green"
									>Selecionar Candidato</button>
								}
								<Link
									className='detalhe-item__link detalhe-item__link--etapa'
									to={`/candidaturas/${item.candidaturaid}`}>
									<button
										className="button button--green"
										>Ver Detalhes do Candidato</button>
								</Link>
							</div>
						</div>
					)
				) : <p className="message">{message}</p>
			}
			</div>
		</div>
  	)
}

export default Candidaturas