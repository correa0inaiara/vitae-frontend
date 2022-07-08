import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { editVacancy, editQuestions, registerQuestionnarie, getTypesOfHiringAndBenefits, getQuestionnaire, registerVacancy } from '../data/ApiService';
import Button from './Button';

export class VagaFormulario extends Component {
	constructor(props) {
		super(props)

		const temProps = props && Object.keys(props).length > 0 ? true : false

		const editing = temProps && props.edit ? true : false

		this.state = {
			user: [],
			nome: editing ? props.data.nome : '',
			descricao: editing ? props.data.descricao : '',
			salario: editing ? props.data.salario : '',
			status: editing ? props.data.status : 'Aberto',
			localizacao: editing ? props.data.localizacao : '',
			prazo: editing ? props.data.prazo : '',
			tiposContratacao: [],
			tipoContratacaoSelecionado: editing ? props.data.tipoContratacaoId : '',
			beneficios: [],
			beneficiosExcluidos: [],
			beneficiosAdicionados: [],
			beneficioSelecionado: '',
			beneficiosOferecidos: editing ? props.data.beneficiosOferecidos : [],
			questionarios: [],
			questionarioSelecionado: editing ? props.data.questionarioId : '',
			created: false,
			validations: {
				nome: {
					obrigatorio: false,
					invalido: false
				},
				descricao: {
					obrigatorio: false,
					invalido: false
				},
				prazo: {
					obrigatorio: false,
					invalido: false
				},
				salario: {
					obrigatorio: false,
					invalido: false
				},
				status: {
					obrigatorio: false
				},
				tipoContratacaoSelecionado: {
					obrigatorio: false
				},
				beneficioSelecionado: {
					obrigatorio: false
				},
				localizacao: {
					obrigatorio: false,
					invalido: false
				}
			}
		}

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
		this.handleOnBlur = this.handleOnBlur.bind(this);
		this.handleOnChange = this.handleOnChange.bind(this);
		this.checkValidations = this.checkValidations.bind(this);
		this.handleValidations = this.handleValidations.bind(this);
		this.validacaoRegex = this.validacaoRegex.bind(this);
		this.clearForm = this.clearForm.bind(this);
		this.handleAddOrEditBeneficio = this.handleAddOrEditBeneficio.bind(this);
		this.handleDeleteBeneficio = this.handleDeleteBeneficio.bind(this);
	}

	async componentDidMount() {
		const _user = localStorage.getItem("user")
		let userJson

		if (_user) {
			userJson = JSON.parse(_user)

			
			if (userJson && userJson.token) {
				const tiposContratacaoEBeneficios = await getTypesOfHiringAndBenefits(userJson.token)
				const questionariosResult = await getQuestionnaire(userJson.usuarioId, userJson.token)
				
				let questionariosArr = []
				questionariosResult.map(item => {
					const questionarioObj = item.questionario
					questionariosArr.push({
						nome: questionarioObj.nome,
						questionarioId: questionarioObj.questionarioid
					})
				})

				const tiposContratacao = tiposContratacaoEBeneficios.tiposContratacao
				const beneficios = tiposContratacaoEBeneficios.beneficios
				const questionarios = questionariosArr
				
				this.setState((state) => {
					return { 
						user: userJson,
						tiposContratacao, 
						beneficios, 
						questionarios
					}
				})
			}
 
		} else {
			console.log('Erro ao recuperar os dados do usuário.')
			return false
		}
	}

	handleOnBlur(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		if (name === 'prazo') {
			const today = new Date()
			const tyear = today.getFullYear() + 2
			const newDate = new Date(value)
			const year = newDate.getFullYear() + 1
			let dataInvalida = false

			if ((newDate <= today) || (year > tyear)) {
				dataInvalida = true
			}
			
			if (dataInvalida) {
				this.setState((item) => {
					return item.validations[name].invalido = true
				})
			} else {
				this.setState((item) => {
					return item.validations[name].invalido = false
				})
			}
		}

		if (value === '') {
			this.setState((item) => {
				return item.validations[name].obrigatorio = false
			})
			this.setState((item) => {
				return item.validations[name].invalido = false
			})
		}
	}

	checkValidations(event) {
		const passouObg = Object.values(this.state.validations).find(item => {
			if (typeof item?.obrigatorio !== 'undefined') {
				if (item.obrigatorio) return item.obrigatorio
			}
		})

		const passouInv = Object.values(this.state.validations).find(item => {
			if (typeof item?.invalido !== 'undefined') {
				if (item.invalido) return item.invalido
			}
		})

		if (typeof passouObg === 'undefined' &&
			typeof passouInv === 'undefined') {
			this.setState((item) => {
				return item.validacaoConcluida = true
			})
		} else {
			this.setState((item) => {
				return item.validacaoConcluida = false
			})
		}
	}

	validacaoRegex(pattern, value, name) {
		const result = value.match(pattern);
		const match = !result ? false : true;
		if (!result) {
			this.setState((item) => {
				return item.validations[name].invalido = true
			})
		} else {
			this.setState((item) => {
				return item.validations[name].invalido = false
			})
		}
		
		return match;
	}

	handleValidations(event) {
		const target = event.target;
		let value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		if (name === 'nome') {
			const pattern = /^[a-zA-Z\u00C0-\u00FF 0-9!#-_&?']+$/
			this.validacaoRegex(pattern, value, name)
		}

		if (name === 'salario') {
			const pattern = /^(?:\.|,|[0-9])*$/
			this.validacaoRegex(pattern, value, name)
		}

		// if (name === 'questao') {
		// 	const pattern = /^[a-zA-Z\u00C0-\u00FF 0-9!#-_&?']+$/
		// 	this.validacaoRegex(pattern, value, name)
		// }

		this.setState({
			[name]: value
		})
	}

	handleOnChange(event) {
		this.handleValidations(event)
		this.checkValidations();
	}

	handleAddOrEditBeneficio(event) {
		const beneficio = this.state.beneficios.find(item => item.beneficio === this.state.beneficioSelecionado)

		const newBeneficio = {
			beneficioId: beneficio.beneficioid,
			beneficio: this.state.beneficioSelecionado
		}

		this.setState({
			beneficioSelecionado: '',
			beneficiosOferecidos: [...this.state.beneficiosOferecidos, newBeneficio]
		})

		if (this.props.edit) {
			this.setState({
				beneficiosAdicionados: [this.state.beneficiosAdicionados, beneficio]
			})
		}
	}

	clearForm() {
		this.setState({
			nome: '',
			descricao: '',
			prazo: '',
			salario: '',
			status: '',
			localizacao: '',
			beneficiosOferecidos: [],
			tipoContratacaoSelecionado: '',
			questionarioSelecionado: ''
		})
	}

	async handleEditSubmit(vagaId, token, data) {

		const beneficiosAdicionados = this.state.beneficiosAdicionados
		const beneficiosExcluidos = this.state.beneficiosExcluidos
		const beneficiosOferecidosObj = {
			beneficiosAdicionados,
			beneficiosExcluidos
		}

		const result = await editVacancy(vagaId, token, data, beneficiosOferecidosObj)

		if (result) {
			this.props.callback()
			this.clearForm()
		}
	}

	async handleRegisterSubmit(event, questionarioId, tipoContratacaoId, usuarioId, token, data, beneficiosOferecidos) {
		let result = await registerVacancy(questionarioId, tipoContratacaoId, usuarioId, token, data, beneficiosOferecidos)
		if (result) {
			this.setState({created: true})
			this.props.callback()
			this.clearForm()
		}
		else this.setState({created: false})
	}

	handleSubmit(event) {
		event.preventDefault()

		this.state.status = this.state.status === 'Aberto' ? true : false 

		let tipoContratacaoId = this.state.tipoContratacaoSelecionado
		let questionarioId = this.state.questionarioSelecionado ? this.state.questionarioSelecionado : null

		const data = {
			nome: this.state.nome,
			descricao: this.state.descricao,
			prazo: this.state.prazo,
			salario: this.state.salario,
			localizacao: this.state.localizacao,
			status: this.state.status
		}

		const beneficiosOferecidos = this.state.beneficiosOferecidos
		const oldData = this.props.data
		
		

		const token = this.state.user.token
		const usuarioId = this.state.user.usuarioId
		
		
		if (this.props.edit) {
			data.tipoContratacaoId = tipoContratacaoId
			data.questionarioId = questionarioId
			const vagaId = this.props.data.vagaId
			this.handleEditSubmit(vagaId, token, data)
		} else {
			this.handleRegisterSubmit(event, questionarioId, tipoContratacaoId, usuarioId, token, data, beneficiosOferecidos)
		}

	}

	handleDeleteBeneficio(index, beneficio) {
		const beneficioObj = this.state.beneficiosOferecidos
		beneficioObj.splice(index, 1)
		this.setState({
			beneficiosOferecidos: beneficioObj
		})

		if (this.props.edit) {
			this.setState({
				beneficiosExcluidos: [this.state.beneficiosExcluidos, beneficio]
			})
		}
	}

	render() {

		const listagemBeneficiosOferecidos = (
			this.state.beneficiosOferecidos && this.state.beneficiosOferecidos.length > 0 ? (
				this.state.beneficiosOferecidos.map((item, index) => 
					<li key={index} className="listagem-item">
						<div className="listagem-item__subitem">
							<span className="listagem-item__subitem-label">Benefício:</span>
							<span className="listagem-item__subitem-value">{item.beneficio}</span>
						</div>
						<div className="buttons">
							<button 
								type="button"
								onClick={this.handleDeleteBeneficio.bind(this, index, item)}
								className="button button--red">Deletar</button>
						</div>
					</li>
				)
			) : ''
		)

		return (
			<form
				onSubmit={this.handleSubmit}
				id="vagas"
				className='form'
			>
				<div className="section section-1">
					<h2 className="subtitle">Vaga</h2>
					<label htmlFor="inp-nome" className="label">
						Nome
						<input
							name="nome"
							value={this.state.nome}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="text"
							id="inp-nome" />
						<div className="error-messages">
							{this.state.validations.nome.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.nome.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<label htmlFor="inp-descricao" className="label">
						Descrição
						<textarea
							name="descricao"
							value={this.state.descricao}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							rows="15"
							id="inp-descricao" />
						<div className="error-messages">
							{this.state.validations.descricao.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.descricao.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<label htmlFor="inp-localizacao" className="label">
						Localização
						<input
							type="text"
							name="localizacao"
							value={this.state.localizacao}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							id="inp-localizacao" />
						<div className="error-messages">
							{this.state.validations.localizacao.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.localizacao.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<label htmlFor="inp-salario" className="label">
						Salário
						<input
							type="text"
							name="salario"
							value={this.state.salario}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							id="inp-salario" />
						<div className="error-messages">
							{this.state.validations.salario.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.salario.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<div className="opcoes-container">
						<p className="section-name">Status</p>
						<div className="opcoes">
							<label htmlFor="inp-status-aberto" className="label">
								<input
									name="status"
									value='Aberto'
									checked={this.state.status === 'Aberto'}
									onBlur={this.handleOnBlur}
									onChange={this.handleOnChange}
									type="radio"
									id="inp-status-aberto" />
								Aberto
							</label>
							<label htmlFor="inp-status-fechado" className="label">
								<input
									name="status"
									value='Fechado'
									checked={this.state.status === 'Fechado'}
									onBlur={this.handleOnBlur}
									onChange={this.handleOnChange}
									type="radio"
									id="inp-status-fechado" />
									Fechado
							</label>
						</div>
						<div className="error-messages">
							{this.state.validations.status.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
						</div>
					</div>
					<label htmlFor="inp-prazo" className="label">
						Prazo
						<input
							name="prazo"
							value={this.state.prazo}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="datetime-local"
							id="inp-prazo" />
						<div className="error-messages">
							{this.state.validations.prazo.obrigatorio ? <span 	className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.prazo.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					{
						this.state.tiposContratacao && this.state.tiposContratacao.length > 0 ? (
							<div className="selecao">
								<p className="section-name">Tipo de Contratação</p>
								<select
									name="tipoContratacaoSelecionado"
									value={this.state.tipoContratacaoSelecionado}
									onBlur={this.handleOnBlur}
									onChange={this.handleOnChange} 
									className='select' 
									id="sel-tipoContratacaoSelecionado">
									<option value="selecione">Selecione</option>
									{this.state.tiposContratacao.map(item => 
										<option key={item.tipocontratacaoid} value={item.tipocontratacaoid}>{item.contratacao}</option>
									)}
								</select>
								<div className="error-messages">
									{this.state.validations.tipoContratacaoSelecionado.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
								</div>
							</div>
						) : ''
					}
					{
						this.state.questionarios && this.state.questionarios.length > 0 ? (
							<div className="selecao">
								<p className="section-name">Questionários</p>
								<select
									name="questionarioSelecionado"
									value={this.state.questionarioSelecionado}
									onBlur={this.handleOnBlur}
									onChange={this.handleOnChange} 
									className='select' 
									id="sel-questionarioSelecionado">
									<option value="selecione">Selecione</option>
									{this.state.questionarios.map(item => 
										<option key={item.questionarioId} value={item.questionarioId}>{item.nome}</option>
									)}
								</select>
							</div>
						) : (
							<div className="lista-vazia">
								<p className="mensagem">Você não possui questionários criados. Eles não são obrigatórios, mas se quiser adicionar um à essa vaga, precisa criá-lo na página de questionários antes.</p>
								<div className="buttons">
									<Link 
										className="lista-vazia__button"
										to='/questionarios'>
										<Button buttonClass='button button--green' buttonText='Ir para Questionários' />
									</Link>
								</div>
							</div>
						)
					}
				</div>
				{
					this.state.beneficios && this.state.beneficios.length > 0 ? (
						<div className="section section-2">
							<h2 className="subtitle">Beneficios</h2>
							{this.state.beneficiosOferecidos && this.state.beneficiosOferecidos.length > 0 ? <div className="listagem">
								<p className="section-name">Benefícios Adicionados:</p>
								<ul className="listagem">
									{listagemBeneficiosOferecidos}
								</ul>
							</div> : '' }
							<div className="selecao">
								<p className="section-name">Benefício</p>
								<select
									name="beneficioSelecionado"
									value={this.state.beneficioSelecionado}
									onBlur={this.handleOnBlur}
									onChange={this.handleOnChange} 
									className='select' 
									id="sel-beneficioSelecionado">
									<option value="selecione">Selecione</option>
									{this.state.beneficios.map(item => 
										<option key={item.beneficioid} value={item.beneficio}>{item.beneficio}</option>
									)}
								</select>
								<div className="error-messages">
									{this.state.validations.beneficioSelecionado.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
								</div>
							</div>
							<div className="buttons">
								<button
									disabled={!this.state.beneficioSelecionado}
									onClick={this.handleAddOrEditBeneficio} 
									type="button" 
									className="button">
									Adicionar Benefício
								</button>
							</div>
						</div>
					) : ''
				}

				<div className="buttons">
					<button
						disabled={!this.state.nome || !this.state.descricao || !this.state.prazo || !this.state.localizacao || !this.state.salario || this.state.beneficiosOferecidos.length === 0}
						onClick={this.handleSubmit} 
						type="button" 
						className="button">
						{this.props.edit ? 'Editar Vaga' : 'Criar Vaga'}
					</button>
				</div>
			</form>
		)
	}
}

export default VagaFormulario