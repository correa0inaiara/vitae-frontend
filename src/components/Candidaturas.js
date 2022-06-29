import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom';
import { registerSelectedCandidate } from '../data/ApiService';

const Candidaturas = ({ callback, candidaturasData, usuario, processoSeletivoData }) => {

	const [candidaturas, setCandidaturas] = useState(candidaturasData)
	const [candidatoSelecionado, setCandidatoSelecionado] = useState(false)
	const [processoSeletivo, setProcessoSeletivo] = useState(processoSeletivoData)
	const [message, setMessage] = useState('Não há candidaturas para esta vaga');
	

	const handleSelectCandidate = async function (candidaturaId) {
		const result = await registerSelectedCandidate(candidaturaId, processoSeletivo.processoseletivoid, usuario.token)
		setCandidatoSelecionado(true)
		callback()
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
						<div key={index} className="detalhes-candidatura">
							<p className="detalhe-item__label">Nome do Candidato:</p>
							<p className="detalhe-item__value">{item.candidato.nomecompleto}</p>
							<div className="buttons">
								<button
									onClick={handleSelectCandidate.bind(this, item.candidaturaid)}
									className="button button--green"
									>Selecionar Candidato</button>
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