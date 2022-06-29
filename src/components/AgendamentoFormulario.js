import React, { Component } from 'react'
import { createSchedule, editSchedule, getSelectedCandidates } from '../data/ApiService';

export class AgendamentoFormulario extends Component {
	constructor(props) {
		super(props)
        console.log("🚀 ~ file: AgendamentoFormulario.js ~ line 7 ~ AgendamentoFormulario ~ constructor ~ props", props)

		const temProps = props && Object.keys(props).length > 0 ? true : false

		const editing = temProps && props.edit ? true : false

		this.state = {
			user: props.usuario,
			motivo: editing ? props.data.motivo : '',
			localizacao: editing ? props.data.localizacao : '',
			dia: editing ? props.data.dia : '',
			hora: editing ? props.data.hora : '',
			candidatoSelecionadoId: editing ? props.data.candidatoSelecionadoId : '',
			candidatoSelecionado: editing ? props.data.nomeCandidato : '',
			processoSeletivoSelecionado: editing ? props.data.processoSeletivoId : '',
			processoSeletivoData: props.data,
			candidatosSelecionados: [],
			created: false,
			validations: {
				motivo: {
					obrigatorio: false,
					invalido: false
				},
				localizacao: {
					obrigatorio: false,
					invalido: false
				},
				dia: {
					obrigatorio: false,
					invalido: false
				},
				hora: {
					obrigatorio: false,
					invalido: false
				},
				candidatoSelecionadoId: {
					obrigatorio: false
				}
			}
		}

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

			/* 
				processo seletivo
				- etapa 1:
					- lista das candidaturas
						- aqui seleciono os candidatos
				- etapa 2:
					- agendamento
						- aqui realizo os agendamentos para os candidatos selecionados
				- etapa 3:
					- resumo
						- aqui listo um resumo do processo seletivo
			*/
			
			if (userJson && userJson.token) {

				let candidatosSelecionados = []
				const _candidatosSeleciondos = localStorage.getItem("candidatosSelecionados")
				if (_candidatosSeleciondos) {
					candidatosSelecionados = JSON.parse(_candidatosSeleciondos)
				} else {
					candidatosSelecionados = await getSelectedCandidates(this.props.data.processoseletivoid, userJson.token)
					console.log("🚀 ~ file: ProcessoSeletivoEtapa1.js ~ line 37 ~ getList ~ candidatosSelecionados", candidatosSelecionados)
				}
			
				this.setState((state) => {
					return { 
						user: userJson,
						candidatosSelecionados: candidatosSelecionados
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

		if (name === 'motivo') {
			const pattern = /^[a-zA-Z0-9\u00C0-\u00FF ']+$/
			this.validacaoRegex(pattern, value, name)
		}

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
			motivo: '',
			dia: '',
			hora: '',
			localizacao: '',
			candidatoSelecionadoId: '',
		})
	}

	async handleEditSubmit(token, data) {

		const result = await editSchedule(this.props.data.agendamentoId, token, data)

		if (result) {
			this.props.callback()
			this.clearForm()
		}
	}

	handleSubmit(event) {
		event.preventDefault()

		const data = {
			motivo: this.state.motivo,
			dia: this.state.dia,
			hora: this.state.hora,
			localizacao: this.state.localizacao
		}

		const processoSeletivoId = this.props.data.processoseletivoid
		const candidatoSelecionadoId = this.state.candidatoSelecionadoId

		const token = this.state.user.token
		
		if (this.props.edit) {
			const result = this.handleEditSubmit(token, data)
			if (result) {
				this.props.callback()
				this.clearForm()
			}
		} else {
			let result
				result = createSchedule(processoSeletivoId, candidatoSelecionadoId, token, data)
			if (result) {
				this.setState({created: true})
				this.props.callback()
				this.clearForm()
			}
			else this.setState({created: false})
		}

	}

	render() {

		return (
			<form
				onSubmit={this.handleSubmit}
				id="agendamentos"
				className='form'
			>
				{<div className="section section-1">
					<h2 className="subtitle">Agendamento</h2>
					<label htmlFor="inp-nome" className="label">
						Motivo
						<input
							name="motivo"
							value={this.state.motivo}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="text"
							id="inp-motivo" />
						<div className="error-messages">
							{this.state.validations.motivo.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.motivo.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<label htmlFor="inp-dia" className="label">
						Dia
						<input
							type="date"
							name="dia"
							value={this.state.dia}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							id="inp-dia" />
						<div className="error-messages">
							{this.state.validations.dia.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.dia.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<label htmlFor="inp-hora" className="label">
						Hora
						<input
							type="time"
							name="hora"
							value={this.state.hora}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							id="inp-hora" />
						<div className="error-messages">
							{this.state.validations.hora.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.hora.invalido ? <span className="error-message">Campo inválido</span> : '' }
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
					{
						this.state.candidatosSelecionados && this.state.candidatosSelecionados.length > 0 ? (
							<div className="selecao">
								<p className="section-name">Candidato (a) Selecionado</p>
								<select
									name="candidatoSelecionadoId"
									value={this.state.candidatoSelecionadoId}
									onBlur={this.handleOnBlur}
									onChange={this.handleOnChange} 
									className='select' 
									id="sel-candidatoSelecionado">
									<option value="selecione">Selecione</option>
									{this.state.candidatosSelecionados.map(item => 
										<option key={item.candidatoselecionadoid} value={item.candidatoselecionadoid}>{item.nomecompleto}</option>
									)}
								</select>
								<div className="error-messages">
									{this.state.validations.candidatoSelecionadoId.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
								</div>
							</div>
						) : ''
					}
				</div>}
				
				<div className="buttons">
					<button
						disabled={!this.state.motivo || !this.state.dia || !this.state.hora || !this.state.localizacao || this.state.candidatoSelecionadoId === 'Selecionado'}
						onClick={this.handleSubmit} 
						type="button" 
						className="button">
						{this.props.edit ? 'Editar Agendamento' : 'Criar Agendamento'}
					</button>
				</div>
			</form>
		)
	}
}

export default AgendamentoFormulario