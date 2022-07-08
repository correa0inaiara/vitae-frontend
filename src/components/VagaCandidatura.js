import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { createApplication, getAnsweredQuestions, getCurriculums, getVacancyApplication } from '../data/ApiService'
import Loader from './Loader'

const VagaCandidatura = () => {

	const [vagaData, setVagaData] = useState()
	const [vagaEmpresa, setVagaEmpresa] = useState()
	const [candidatura, setCandidatura] = useState()
	const [vagaQuestionario, setVagaQuestionario] = useState()
	const [vagaBeneficiosOferecidos, setBeneficiosOferecidos] = useState()
	const [vagaTipoContratacao, setVagaTipoContratacao] = useState()
	const [curriculoSelecionado, setCurriculoSelecionado] = useState('')	
	const [curriculos, setCurriculos] = useState([])	
	const [loader, setLoader] = useState(false)	
	const [usuario, setUsuario] = useState('')	
	const [questionarioRespondido, setQuestionarioRespondido] = useState(false)
	
	const params = useParams()
	
	const updateVacancyApplication = async function (user) {
		const response = await getVacancyApplication(params.vagaId, user.usuarioId, user.token)

		if (response.ok) {
			const vaga = await response.json()

			setVagaData(vaga[0])
			setCandidatura(vaga[0].candidatura)
			
			setVagaEmpresa(vaga[0].empresa.length === 1 ? vaga[0].empresa[0] : null)
			setVagaQuestionario(vaga[0].questionario)
			setVagaTipoContratacao(vaga[0].tipoContratacao)
			setBeneficiosOferecidos(vaga[0].beneficiosOferecidos)

			localStorage.setItem('questionarioCandidatura', JSON.stringify(vaga[0].questionario))
			localStorage.setItem('vagaCandidatura', JSON.stringify(vaga[0]))

		} else {
			console.log('Erro no serviço')
		}
		setLoader(false)
	}

	useEffect(() => {
		async function getUser() {
			const _user = localStorage.getItem("user")
			let user
			setLoader(true)

			if (_user) {
				user = JSON.parse(_user)
				setUsuario(user)

				updateVacancyApplication(user)
			}
			setLoader(false)	
		}
		getUser()
	}, [])

	useEffect(() => {
		async function updateQuestionarioRespondido() {
			if (vagaData && usuario && vagaQuestionario) {
				const questoesRespondidas = await getAnsweredQuestions(vagaData.questionarioid, usuario.token)
				const questoes = vagaQuestionario.questoes
		
				if (questoes.length === questoesRespondidas.length) {
					setQuestionarioRespondido(true)
				} else {
					setQuestionarioRespondido(false)
				}
			}

			if (vagaData && candidatura) {
				const curriculo = vagaData.candidatura.curriculo
				setCurriculoSelecionado(curriculo.curriculoid)
			} else {
				if (usuario) {
					const curriculos = await getCurriculums(usuario.usuarioId, usuario.token)
					setCurriculos(curriculos)
				}
			}
		}
		updateQuestionarioRespondido()
	}, [vagaData, usuario, vagaQuestionario, candidatura])

	const handleCandidatura = async function () {
		const candidatura = await createApplication(usuario.usuarioId, vagaData.vagaid, curriculoSelecionado, usuario.token)
		setLoader(true)
		updateVacancyApplication(usuario)
	}
	
	return (
		<div className="detalhe">
			<Link
				className='detalhe-item__link detalhe-item__link--center'
				to={`/vagas/todas`}>
				<button
					className="button button--grey"
					>Voltar para Todas as Vagas</button>
			</Link>
			{
				vagaData ? (
					<>
						<div className="detalhes-candidatura">
							{ 
								candidatura && Object.keys(candidatura).length > 0 ? (
									<div className="detalhes-candidatura__realizada">
										<div className="detalhes-candidatura__mensagens">
											<p className="mensagem mensagem--verde">
												Parabéns!
											</p>
											<p className="mensagem mensagem--verde">
												Você já se candidatou à essa vaga.
											</p>
											<p className="mensagem mensagem--verde">
												Boa Sorte!
											</p>
										</div>
									</div>
								) : (
									<div className="detalhes-candidatura__nao-realizada">
										{
											curriculos && curriculos.length > 0 ? (
												<>
													<p className="mensagem">Para se candidatar você precisa selecionar um currículo para ser enviado.</p>
													<div className="selecao">
														<p className="section-name">Currículos</p>
														<select
															name="curriculoSelecionado"
															value={curriculoSelecionado}
															onChange={(e) => setCurriculoSelecionado(e.target.value)}
															className='select' 
															id="sel-curriculoSelecionado">
															<option value="selecione">Selecione</option>
															{curriculos.map(item => 
																<option key={item.curriculoid} value={item.curriculoid}>{item.nome}</option>
															)}
														</select>
													</div>
													{
														vagaQuestionario ? (
															<div className="candidatura-questionarios">
																{
																	questionarioRespondido ? (
																		<p className="mensagem mensagem--verde mensagem--center">Legal, você já respondeu esse questionário. Se quiser ver suas respostas pode clicar no botão abaixo.</p>
																	) : (
																		<p className="mensagem">Há um questionário associado à essa vaga que é necessário ser preenchido. Por favor, clique no botão abaixo para respondê-lo, caso contrário, você não poderá se candidatar.</p>
																	)
																}
																<div className="buttons">
																	<Link
																		className='detalhe-item__link detalhe-item__link--etapa'
																		to={`/questionarios/${vagaData.questionarioid}`}>
																		<button
																			className="button button--green"
																			>{`${questionarioRespondido ? 'Ver Questionário' : 'Responder Questionário'}`}</button>
																	</Link>
																</div>
															</div>
														) : <p className="mensagem">Essa vaga não possui um questionário atribuído.</p>
													}
												</>
											) : <p className="mensagem">Você não possui curriculos cadastrados.</p>
										}
										
										<div className="buttons">
											<button
												disabled={!curriculoSelecionado || (vagaQuestionario && !questionarioRespondido)}
												onClick={handleCandidatura} 
												type="button" 
												className="button">
												Me Candidatar à essa Vaga
											</button>
										</div>
									</div>
								)
							}	
						</div>
						{
							vagaEmpresa ? (
								<div className="detalhes-empresa">
									<h3 className="detalhes-empresa__title">Sobre a Empresa</h3>
									<div className="detalhe-item">
										<p className="detalhe-item__label">Nome da Empresa:</p>
										<p className="detalhe-item__value">{vagaEmpresa.nomedaempresa}</p>
									</div>
									<div className="detalhe-item">
										<p className="detalhe-item__label">CNPJ:</p>
										<p className="detalhe-item__value">{vagaEmpresa.cnpj}</p>
									</div>
									<div className="detalhe-item">
										<p className="detalhe-item__label">Ramo da Empresa:</p>
										<p className="detalhe-item__value">{vagaEmpresa.ramodaempresa}</p>
									</div>
									<div className="detalhe-item">
										<p className="detalhe-item__label">Número de Funcionários:</p>
										<p className="detalhe-item__value">{vagaEmpresa.numerodefuncionarios}</p>
									</div>
									<div className="detalhe-item">
										<p className="detalhe-item__label">Website:</p>
										<p className="detalhe-item__value">{vagaEmpresa.website}</p>
									</div>
								</div>
							) : ''
						}
						{
							vagaData ? (
								<div className="detalhes-vaga">
									<h3 className="detalhes-vaga__title">Sobre a Vaga</h3>
									<div className="detalhe-item">
										<p className="detalhe-item__label">Nome:</p>
										<p className="detalhe-item__value">{vagaData.nome}</p>
									</div>
									<div className="detalhe-item">
										<p className="detalhe-item__label">Descrição:</p>
										<p className="detalhe-item__value">{vagaData.descricao}</p>
									</div>
									<div className="detalhe-item">
										<p className="detalhe-item__label">Localização:</p>
										<p className="detalhe-item__value">{vagaData.localizacao}</p>
									</div>
									<div className="detalhe-item">
										<p className="detalhe-item__label">Salário:</p>
										<p className="detalhe-item__value">{vagaData.salario}</p>
									</div>
									<div className="detalhe-item">
										<p className="detalhe-item__label">Prazo:</p>
										<p className="detalhe-item__value">{vagaData.prazo}</p>
									</div>
									<div className="detalhe-item">
										<p className="detalhe-item__label">Status:</p>
										<p className="detalhe-item__value">{vagaData.status}</p>
									</div>
									{
										vagaTipoContratacao ? (
											<div className="detalhe-item">
												<p className="detalhe-item__label">Tipo de Contratação:</p>
												<p className="detalhe-item__value">{vagaTipoContratacao.contratacao}</p>
											</div>
										) : ''
									}
									<div className="detalhe-item">
										<p className="detalhe-item__label">Questionário:</p>
										{
											vagaData.questionarioid ? (
												<p className="detalhe-item__value">{vagaQuestionario.nome}</p>
											) : (
												<p className="mensagem">Essa vaga não tem questionário associado.</p>
											)
										}
									</div>
									{
										vagaBeneficiosOferecidos && vagaBeneficiosOferecidos.length > 0 ? (
											<div className="detalhe-item">
												<p className="detalhe-item__subitem-label">Benefícios Oferecidos: </p>
												{vagaBeneficiosOferecidos.map((item, index) => (
													<div key={item.beneficiosoferecidosid} className="detalhe-item__subitem">
														<p className="detalhe-item__label">Benefício: </p>
														<p className="detalhe-item__value">{item.beneficio}</p>
													</div>
												))}
											</div>
										) : ''
									}
								</div>
							) : ''
						}
					</>
				) : <Loader />
			}
		</div>
	)
}
export default VagaCandidatura