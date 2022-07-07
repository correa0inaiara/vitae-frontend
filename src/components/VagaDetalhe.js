import React, { useState } from 'react'
import { createApplication, deleteVacancy, getCSVExport, registerAnsweredQuestions } from '../data/ApiService'
import VagaFormulario from './VagaFormulario'

const VagaDetalhe = ({ 
	callback, 
	data, 
	usuario, 
	todas = false, 
	candidaturas, 
	curriculos }) => {
	const vaga = data.vaga
	const beneficiosOferecidos = data.beneficiosOferecidos

	let empresa = []
	if (todas) {
		empresa = data.empresa
	}

	const [candidaturaRealizada, setCandidaturaRealizada] = useState(() => {
		if (usuario.tipoUsuario === 'Candidato') {
			return (candidaturas && Object.keys(candidaturas).length > 0) ? true : false
		} else {
			return false
		}
	})

	const [curriculoSelecionado, setCurriculoSelecionado] = useState('')
	const [vagaEmpresa, setVagaEmpresa] = useState(empresa)
	const [vagaData, setVagaData] = useState(vaga)
	const [vagaNome, setVagaNome] = useState(vaga.nome)
	const [vagaDescricao, setVagaDescricao] = useState(vaga.descricao)
	const [vagaPrazo, setVagaPrazo] = useState(() => {
		return vaga.prazo.replace('Z', '')
	})
	const [vagaSalario, setVagaSalario] = useState(vaga.salario)
	const [vagaStatus, setVagaStatus] = useState(() => {
		return vaga.status ? 'Aberto' : 'Fechado'
	})
	const [vagaLocalizacao, setVagaLocalizacao] = useState(vaga.localizacao)
	
	const [vagaTipoContratacao, setVagaTipoContratacao] = useState(vaga.tipoContratacao)
	const [vagaTipoContratacaoId, setVagaTipoContratacaoId] = useState(vaga.tipocontratacaoid)
	const [vagaQuestionarioId, setVagaQuestionarioId] = useState(vaga.questionarioid)
	const [vagaQuestoesId, setVagaQuestoesId] = useState(vaga.questionarioid)
	const [vagaQuestionario, setVagaQuestionario] = useState(vaga.questionario)
	const [vagaQuestoesRespondidas, setVagaQuestoesRespondidas] = useState([])
	const [vagaQuestaoRespondidaArr, setVagaQuestaoRespondidaArr] = useState([])

	const [vagaBeneficiosOferecidos, setBeneficiosOferecidos] = useState(beneficiosOferecidos)
	
	const [edit, setEdit] = useState(false)
	const [editData, setEditData] = useState(false)

	const handleDelete = async function (event) {
		const result = await deleteVacancy(vagaData.vagaid, usuario.token)
		callback()
	}

	const handleEdit = function (event) {
		setEdit(true)
		const data = {
			nome: vagaNome,
			descricao: vagaDescricao,
			prazo: vagaPrazo,
			salario: vagaSalario,
			localizacao: vagaLocalizacao,
			status: vagaStatus,

			tipoContratacao: vagaTipoContratacao,
			tipoContratacaoId: vagaTipoContratacaoId,

			beneficiosOferecidos: vagaBeneficiosOferecidos,
			
			questionario: vagaQuestionario,
			questionarioId: vagaQuestionarioId,
			
			vagaId: vagaData.vagaid
		}
		setEditData(data)
	}

	const handleOnBlur = function (questaoid, questao, index, event) {
		if (vagaQuestoesRespondidas && vagaQuestoesRespondidas.length > 0) {
			const indexArr = vagaQuestoesRespondidas.findIndex(item => item.questoesId === questaoid)
			if (indexArr !== -1) {
				vagaQuestoesRespondidas[index].resposta = event.target.value
				vagaQuestoesRespondidas[index].questoesId = questaoid
				vagaQuestoesRespondidas[index].questao = questao
				setVagaQuestoesRespondidas(vagaQuestoesRespondidas)
			} else {
				const data = {
					resposta: event.target.value,
					questoesId: questaoid,
					questao: questao
				}
				
				const arr = [...vagaQuestoesRespondidas, data]
				setVagaQuestoesRespondidas(arr)
			}
		} else {
			const data = {
				resposta: event.target.value,
				questoesId: questaoid,
				questao: questao
			}
			
			const arr = [...vagaQuestoesRespondidas, data]
			setVagaQuestoesRespondidas(arr)
		}

	}

	const handleCandidatura = async function () {
		const candidatura = createApplication(usuario.usuarioId, vagaData.vagaid, curriculoSelecionado, usuario.token)
		
		const questoes = await registerAnsweredQuestions(usuario.token, vagaQuestoesRespondidas)
		
		setCurriculoSelecionado('')
		callback()
	}
	
	const handleExport = async function () {
		const filename = `vagas-${vagaData.vagaid}.csv`
		const result = await getCSVExport('vagas', vagaData.vagaid, filename, usuario.token)
	}
	
	return (
		<div className="detalhe">
			{
				usuario.tipoUsuario === 'Candidato' ? (
					<div className="detalhes-candidatura">
						{ 
							vagaData.candidatura && Object.keys(vagaData.candidatura).length > 0 ? (
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
									<p className="candidatura-nao-realizada__mensagem">Você ainda não se candidatou à essa vaga. </p>
									{
										curriculos && curriculos.length > 0 ? (
											<>
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
													vagaQuestionario && Object.keys(vagaQuestionario).length > 0 ? (
														<div className="questionario">
															<p className="subtitle">Questionário: {vagaQuestionario.nome}</p>
															<div className="listagem">
																{
																	vagaQuestoesRespondidas && vagaQuestoesRespondidas.length > 0 ? (
																		vagaQuestoesRespondidas.map((item, index) => 
																			<div key={index} className="listagem-item listagem-item__block">
																				<div className="listagem-item__subitem">
																					<span className="listagem-item__subitem-label">Questão:</span>
																					<span className="listagem-item__subitem-value">{item.questao}</span>
																				</div>
																				<div className="listagem-item__subitem">
																					<span className="listagem-item__subitem-label">Resposta:</span>
																					<span className="listagem-item__subitem-value">{item.resposta}</span>
																				</div>
																			</div>
																		)
																	) : ''
																}
															</div>
															<ul className="lista-questionario">
																{vagaQuestionario.questoes.map((item, index) => 
																	<li key={index} className="item-questao">
																		<p className="item-questao__name">
																			<span className="item-questao__label">Questão: </span>
																			<span className="item-questao__value">{item.questao}</span>
																		</p>
																		<label htmlFor="inp-resposta" className="label">
																			Resposta
																			<textarea
																				value={vagaQuestaoRespondidaArr[index]}
																				name={`resposta-${index}`}
																				onBlur={(e) => handleOnBlur(item.questoesid, item.questao, index, e)}
																				onChange={(e) => setVagaQuestaoRespondidaArr(e)}
																				rows="15"
																				id={`${item.questoesid}`} />
																		</label>
																	</li>
																)}
															</ul>
														</div>
													) : ''
												}
											</>
										) : ''
									}
									
									<div className="buttons">
										<button
											disabled={!curriculoSelecionado}
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
				) : ''
			}
			{
				usuario.tipoUsuario === 'Candidato' ? (
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
			<div className="detalhes-vaga">
				<h3 className="detalhes-vaga__title">Sobre a Vaga</h3>
				<div className="detalhe-item">
					<p className="detalhe-item__label">Nome:</p>
					<p className="detalhe-item__value">{vagaNome}</p>
				</div>
				<div className="detalhe-item">
					<p className="detalhe-item__label">Descrição:</p>
					<p className="detalhe-item__value">{vagaDescricao}</p>
				</div>
				<div className="detalhe-item">
					<p className="detalhe-item__label">Localização:</p>
					<p className="detalhe-item__value">{vagaLocalizacao}</p>
				</div>
				<div className="detalhe-item">
					<p className="detalhe-item__label">Salário:</p>
					<p className="detalhe-item__value">{vagaSalario}</p>
				</div>
				<div className="detalhe-item">
					<p className="detalhe-item__label">Prazo:</p>
					<p className="detalhe-item__value">{vagaPrazo}</p>
				</div>
				<div className="detalhe-item">
					<p className="detalhe-item__label">Status:</p>
					<p className="detalhe-item__value">{vagaStatus}</p>
				</div>
				<div className="detalhe-item">
					<p className="detalhe-item__label">Tipo de Contratação:</p>
					<p className="detalhe-item__value">{vagaTipoContratacao}</p>
				</div>
				<div className="detalhe-item">
					<p className="detalhe-item__label">Questionário:</p>
					{
						vagaQuestionarioId ? (
							<p className="detalhe-item__value">{vagaQuestionario?.nome}</p>
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
			{
				!todas ? (
					<div className="detalhes-gerenciamento">
						<div className="buttons">
							<button 
								onClick={handleExport}
								className="button button--blue">
									Exportar CSV
							</button>
							<button 
								onClick={handleEdit}
								className="button button--yellow">
									Editar
								</button>
							<button 
								onClick={handleDelete}
								className="button button--red">
									Delete
								</button>
						</div>
						{
							edit ? (
								<VagaFormulario callback={callback} edit={true} data={editData} />
							) : ''
						}
					</div>
				) : ''
			}
		</div>
	)
}
export default VagaDetalhe