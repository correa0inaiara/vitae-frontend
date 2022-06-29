import React, { useState } from 'react'
import { createApplication, deleteVacancy } from '../data/ApiService'
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
	const [vagaQuestionario, setVagaQuestionario] = useState(vaga.questionario)

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

	const handleCandidatura = function () {
		const candidatura = createApplication(usuario.usuarioId, vagaData.vagaid, curriculoSelecionado, usuario.token)
        console.log("🚀 ~ file: VagaDetalhe.js ~ line 81 ~ handleCandidatura ~ candidatura", candidatura)
		setCurriculoSelecionado('')
		callback()
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
										<p className="detalhes-candidatura__mensagem-paragraph">
											Parabéns!
										</p>
										<p className="detalhes-candidatura__mensagem-paragraph">
											Você já se candidatou à essa vaga.
										</p>
										<p className="detalhes-candidatura__mensagem-paragraph">
											Boa Sorte!
										</p>
									</div>
									<p className="detalhes-candidatura__curriculo">{vagaData.candidatura.curriculo.nome}</p>
								</div>
							) : (
								<div className="detalhes-candidatura__nao-realizada">
									<p className="candidatura-nao-realizada__mensagem">Você ainda não se candidatou à essa vaga. </p>
									{
										curriculos && curriculos.length > 0 ? (
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
										) : ''
									}
									
									<button
										disabled={!curriculoSelecionado}
										onClick={handleCandidatura} 
										type="button" 
										className="button">
										Me Candidatar à essa Vaga
									</button>
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
						vagaQuestionario ? (
							<p className="detalhe-item__value">{vagaQuestionario}</p>
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
								onClick={handleEdit}
								className="button button--green">
									Editar
								</button>
							<button 
								onClick={handleDelete}
								className="button button--green">
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