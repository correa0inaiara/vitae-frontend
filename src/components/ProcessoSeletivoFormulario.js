import React, { Component } from 'react'
import { editSelectionProcess, getSelectionProcesses, getVacancy, registerSelectionProcess } from '../data/ApiService';

export class ProcessoSeletivoFormulario extends Component {
	constructor(props) {
		super(props)

		const temProps = props && Object.keys(props).length > 0 ? true : false

		const editing = temProps && props.edit ? true : false

		this.state = {
			user: [],
			nome: editing ? props.data.nome : '',
			descricao: editing ? props.data.descricao : '',
			vagaSelecionada: editing ? props.data.vagaSelecionada : '',
			vagas: [],
			processoSeletivoId: editing ? props.data.processoSeletivoId : '',
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
				vagaSelecionada: {
					obrigatorio: false
				}
			}
		}

		this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
		this.handleEditSubmit = this.handleEditSubmit.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleOnBlur = this.handleOnBlur.bind(this);
		this.handleOnChange = this.handleOnChange.bind(this);
		this.checkValidations = this.checkValidations.bind(this);
		this.handleValidations = this.handleValidations.bind(this);
		this.validacaoRegex = this.validacaoRegex.bind(this);
		this.clearForm = this.clearForm.bind(this);
	}

	async componentDidMount() {
		const _user = localStorage.getItem("user")
		let userJson

		if (_user) {
			userJson = JSON.parse(_user)

			
			if (userJson && userJson.token) {
				
				let vagas = []
				const _vagas = localStorage.getItem('vagas')

				if (_vagas) {
					vagas = JSON.parse(_vagas)

				} else {
					vagas = await getVacancy(userJson.usuarioId, userJson.token)
					
					localStorage.setItem('vagas', JSON.stringify(vagas))
				}
				
				this.setState((state) => {
					return { 
						user: userJson,
						vagas
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

		this.setState({
			[name]: value
		})
	}

	handleOnChange(event) {
		this.handleValidations(event)
		this.checkValidations();
	}

	clearForm() {
		this.setState({
			nome: '',
			descricao: '',
			vagaSelecionada: ''
		})
	}

	async handleEditSubmit(usuarioId, token, data) {
		const result = await editSelectionProcess(usuarioId, this.state.processoSeletivoId, token, data)
		if (result) {
			this.props.callback()
			this.clearForm()
		}
	}

	async handleRegisterSubmit(event, usuarioId, vagaId, token, data) {
		const result = await registerSelectionProcess(usuarioId, vagaId, token, data)
		if (result) {
			this.setState({created: true})
			this.props.callback()
			this.clearForm()
		}
		else this.setState({created: false})
	}

	handleSubmit(event) {
		event.preventDefault()

		const data = {
			nome: this.state.nome,
			descricao: this.state.descricao
		}
		
		let vagaId = this.state.vagaSelecionada

		const token = this.state.user.token
		const usuarioId = this.state.user.usuarioId
		
		
		if (this.props.edit) {
			data.vagaId = vagaId
			this.handleEditSubmit(usuarioId, token, data)
		} else {
			this.handleRegisterSubmit(event, usuarioId, vagaId, token, data)
		}

	}

	render() {

		return (
			<form
				onSubmit={this.handleSubmit}
				id="processosSeletivos"
				className='form'
			>
				<div className="section section-1">
					<h2 className="subtitle">Processos Seletivos</h2>
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
					{
						this.state.vagas && this.state.vagas.length > 0 ? (
							<div className="selecao">
								<p className="section-name">Vagas</p>
								<select
									name="vagaSelecionada"
									value={this.state.vagaSelecionada}
									onBlur={this.handleOnBlur}
									onChange={this.handleOnChange} 
									className='select' 
									id="sel-vagaSelecionada">
									<option value="selecione">Selecione</option>
									{this.state.vagas.map(item => 
										<option key={item.vaga.vagaid} value={item.vaga.vagaid}>{item.vaga.nome}</option>
									)}
								</select>
								<div className="error-messages">
									{this.state.validations.vagaSelecionada.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
								</div>
							</div>
						) : ''
					}
				</div>
				
				<div className="buttons">
					<button
						disabled={!this.state.nome || !this.state.descricao || this.state.vagaSelecionada === 'Selecione' }
						onClick={this.handleSubmit} 
						type="button" 
						className="button">
						{this.props.edit ? 'Editar Processo Seletivo' : 'Criar Processo Seletivo'}
					</button>
				</div>
			</form>
		)
	}
}

export default ProcessoSeletivoFormulario