import React, { Component } from 'react'
import { editQuestionnaire, registerQuestionnarie } from '../data/ApiService';
import Button from './Button';

export class QuestionarioFormulario extends Component {
	constructor(props) {
		super(props)
        console.log("🚀 ~ file: QuestionarioFormulario.js ~ line 8 ~ QuestionarioFormulario ~ constructor ~ props", props)

		const temProps = props && Object.keys(props).length > 0 ? true : false

		const editing = temProps && props.edit ? true : false

		this.state = {
			editQuestionsArr: [],
			editingQuestionIndex: 0,
			editQuestion: false,
			user: [],
			nome: editing ? props.data.nome : '',
			descricao: editing ? props.data.descricao : '',
			prazo: editing ? props.data.prazo : '',
			questao: '',
			questoesAdicionadas: [],
			questoesExcluidas: [],
			questoes: editing ? props.data.questoes : [],
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
				questao: {
					obrigatorio: false,
					invalido: false
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
		this.handleAddOrEditQuestao = this.handleAddOrEditQuestao.bind(this);
		this.handleEditQuestion = this.handleEditQuestion.bind(this);
		this.handleDeleteQuestion = this.handleDeleteQuestion.bind(this);
	}

	componentDidMount() {
		const _user = localStorage.getItem("user")
			let userJson

			if (_user) {
				userJson = JSON.parse(_user)
				this.setState((state) => {
					return { user: userJson }
				})
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
			const pattern = /^[a-zA-Z0-9\u00C0-\u00FF ']+$/
			this.validacaoRegex(pattern, value, name)
		}

		if (name === 'questao') {
			const pattern = /^[a-zA-Z\u00C0-\u00FF 0-9!#-_&?']+$/
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

	handleAddOrEditQuestao(event) {

		if (this.props.edit) {
			if (this.state.editQuestion) {
				const questoesObj = this.state.editQuestionsArr
				const index = this.state.editingQuestionIndex
				questoesObj[index].questao = this.state.questao
				this.setState({
					editQuestion: false,
					editingQuestionIndex: 0,
					questao: '',
					questoes: questoesObj
				})
			} else {
				const newQuestao = {
					questao: this.state.questao
				}
				this.setState({
					questao: '',
					questoes: [...this.state.questoes, newQuestao],
					questoesAdicionadas: [...this.state.questoesAdicionadas, newQuestao]
				})
			}
		} else {
			if (this.state.editQuestion) {
				const questoesObj = this.state.questoes
				const index = this.state.editingQuestionIndex
				questoesObj[index].questao = this.state.questao
				this.setState({
					editQuestion: false,
					editingQuestionIndex: 0,
					questao: '',
					questoes: questoesObj
				})
			} else {
				const newQuestao = {
					questao: this.state.questao
				}
				this.setState({
					questao: '',
					questoes: [...this.state.questoes, newQuestao]
				})
			}
		}
	}

	clearForm() {
		// const formStates = ['nome', 'descricao', 'prazo']
		// Object.keys(this.state).map((item) => {
		// 	formStates.map((item2) => {
		// 		if (item === item2) {
		// 			this.setState((state) => {
		// 				return { state: '' }
		// 			})
		// 		}
		// 	})
		// })
		this.setState({
			nome: '',
			descricao: '',
			prazo: '',
			questoes: []
		})
	}

	async handleEditSubmit(questionarioId, token, data, questoes) {
        console.log("🚀 ~ file: QuestionarioFormulario.js ~ line 243 ~ QuestionarioFormulario ~ handleEditSubmit ~ questoes", questoes)
		const update = {
			questionario: data,
			questoes
		}
		const result = await editQuestionnaire(questionarioId, token, update)
        console.log("🚀 ~ file: QuestionarioFormulario.js ~ line 249 ~ QuestionarioFormulario ~ handleEditSubmit ~ result", result)

		if (result) {
			this.clearForm();
			this.props.callback()
		}
	}

	handleSubmit(event) {
		event.preventDefault()
		console.log(this.state)

		const data = {
			nome: this.state.nome,
			descricao: this.state.descricao,
			prazo: this.state.prazo
		}

		const questoes = {
			questoes: this.state.questoes,
			questoesAdicionadas: this.state.questoesAdicionadas,
			questoesExcluidas: this.state.questoesExcluidas
		}
		const token = this.state.user.token
		const usuarioId = this.state.user.usuarioId
		
		
		if (this.props.edit) {
			const questionarioId = this.props.data.questionarioId
			this.handleEditSubmit(questionarioId, token, data, questoes)
		} else {
			const result = registerQuestionnarie(data, questoes, usuarioId, token)
			if (result) {
				this.setState({created: true})
				this.props.callback()
			}
			else this.setState({created: false})
		}


		this.clearForm()
		
        console.log("🚀 ~ file: QuestionarioFormulario.js ~ line 270 ~ QuestionarioFormulario ~ handleSubmit ~ this.props.", this.props)
	}

	handleEditQuestion(index, questao) {
		
		this.setState((state) => {
			return {
				editingQuestionIndex: index,
				editQuestion: true, 
				questao: questao.questao 
			} 
		})
		const newQuestionsObj = {
			questoesId: questao.questoesid,
			questao: questao.questao
		}
		this.setState({
			editQuestionsArr: [...this.state.editQuestionsArr, newQuestionsObj]
		})
        console.log("🚀 ~ file: QuestionarioFormulario.js ~ line 298 ~ QuestionarioFormulario ~ handleEditQuestion ~ this.state.editQuestionsArr", this.state.editQuestionsArr)
	}

	handleDeleteQuestion(index, questao) {
		const questoesObj = this.state.questoes
		questoesObj.splice(index, 1)
		this.setState({
			questoes: questoesObj
		})

		
		if (this.props.edit) {
			this.setState({
				questoesExcluidas: [this.state.questoesExcluidas, questao]
			})
		}
	}

	render() {

		const listagemQuestoes = this.state.questoes.map((item, index) => 
				<li key={index} className="listagem-item">
					<div className="listagem-item__subitem">
						<span className="listagem-item__subitem-label">Questão {index + 1}:</span>
						<span className="listagem-item__subitem-value">{item.questao}</span>
					</div>
					<div className="buttons">
						<button
							disabled={this.state.editQuestion}
							type="button"
							onClick={this.handleEditQuestion.bind(this, index, item)}
							className="button button--green">Editar</button>
						<button 
							disabled={this.state.editQuestion}
							onClick={this.handleDeleteQuestion.bind(this, index, item)}
							className="button button--green">Deletar</button>
					</div>
				</li>
			);

		return (
			<form
				onSubmit={this.handleSubmit}
				id="questionarios"
				className='form'
			>
				<div className="section section-1">
					<h2 className="subtitle">Questionário</h2>
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
				</div>
				<div className="section section-2">
					<h2 className="subtitle">Questões</h2>
					{this.state.questoes.length > 0 ? <div className="lista-subitem">
						<p className="section-name">Suas questões:</p>
						<ul className="listagem">
							{listagemQuestoes}
						</ul>
					</div> : '' }
					<label htmlFor="inp-questao" className="label">
						Questão
						<input
							name="questao"
							value={this.state.questao}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="text"
							id="inp-questao" />
						<div className="error-messages">
							{this.state.validations.questao.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.questao.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<button
						disabled={!this.state.questao}
						onClick={this.handleAddOrEditQuestao} 
						type="button" 
						className="button">
						{this.state.editQuestion ? 'Editar Questão' : 'Adicionar Questão'}
					</button>
				</div>
				<button
					disabled={this.state.editQuestion || !this.state.nome || !this.state.descricao || !this.state.prazo || this.state.questoes.length === 0}
					onClick={this.handleSubmit} 
					type="button" 
					className="button">
					{this.props.edit ? 'Editar Questionário' : 'Criar Questionário'}
				</button>
			</form>
		)
	}
}

export default QuestionarioFormulario