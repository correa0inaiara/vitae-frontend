import React, { Component } from 'react'
import { createAnsweredQuestion, editQuestionnaire, registerQuestionnarie } from '../data/ApiService';

export class QuestoesFormulario extends Component {
	constructor(props) {
		super(props)

		this.state = {
			questao: this.props.data.questao,
			questoesId: this.props.data.questoesid,
			questionarioId: this.props.data.questionarioid,
			respostaEnviada: '',
			resposta: '',
			validations: {
				resposta: {
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
			resposta: ''
		})
	}

	async handleRegisterSubmit(event, questoesId, data, token, questionarioId) {
		const result = await createAnsweredQuestion(questoesId, token, data, questionarioId)
		if (result) {
			this.setState({
				created: true,
				respostaEnviada: result[0].resposta
			})
			this.props.callback();
			this.clearForm()
		}
		else this.setState({created: false})
	}

	handleSubmit(event) {
		event.preventDefault()

		const data = {
			resposta: this.state.resposta
		}
		const token = this.props.usuario.token
		const questoesId = this.state.questoesId
		const questionarioId = this.state.questionarioId

		this.handleRegisterSubmit(event, questoesId, data, token, questionarioId)
		
	}

	render() {

		const listagemQuestoes =  
				<li className="listagem-item">
					<div className="listagem-item__subitem">
						<span className="listagem-item__subitem-label">Questão: {this.state.questao}</span>
						<span className="listagem-item__subitem-value">{this.state.respostaEnviada}</span>
					</div>
				</li>

		return (
			<form
				onSubmit={this.handleSubmit}
				id="questoes"
				className='form--item'
			>
				<div className="section section-1">
					<h2 className="subtitle">Questão</h2>
					{this.state.respostaEnviada ? <div className="lista-subitem">
						<p className="mensagem">Sua resposta foi enviada com sucesso.</p>
						<p className="section-name">Sua resposta:</p>
						<ul className="listagem">
							{listagemQuestoes}
						</ul>
					</div> : '' }
					<label htmlFor="inp-resposta" className="label">
						Questão: {this.state.questao}
						<input
							name="resposta"
							value={this.state.resposta}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="text"
							id="inp-resposta" />
						<div className="error-messages">
							{this.state.validations.resposta.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.resposta.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
				</div>
				<div className="buttons">
					<button
						disabled={!this.state.resposta || this.state.respostaEnviada}
						onClick={this.handleSubmit} 
						type="button" 
						className="button">
						Enviar Resposta
					</button>
				</div>
			</form>
		)
	}
}

export default QuestoesFormulario