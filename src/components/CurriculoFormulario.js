import React from 'react'
import { Navigate } from 'react-router-dom';
import { editUserCurriculum, registerCurriculum, registerUser } from '../data/ApiService';

class CurriculoFormulario extends React.Component {

	constructor (props) {
		super(props);

		const temProps = props && Object.keys(props).length > 0 ? true : false

		const editing = temProps && props.edit ? true : false

		this.state = {
			editingField: false,
			editingIdiomasIndex: 0,
			editingExperienciasIndex: 0,
			editingHabilidadesIndex: 0,
			editingEducacaoIndex: 0,
			editingCursosIndex: 0,
			nome: editing ? props.data.nome : '',
			descricao: editing ? props.data.descricao : '',
			curso: '',
			localizacaoCurso: '',
			duracaoEmHoras: '',
			cursos: editing ? props.data.cursos : [],
			cursosExcluidos: [],
			cursosAdicionados: [],
			educacao: '',
			localizacaoEducacao: '',
			periodoInicialEducacao: '',
			periodoFinalEducacao: '',
			educacaoArr: editing ? props.data.educacaoArr : [],
			educacaoArrExcluidos: [],
			educacaoArrAdicionados: [],
			cargo: '',
			periodoInicialExperiencia: '',
			periodoFinalExperiencia: '',
			empresa: '',
			experiencias: editing ? props.data.experiencias : [],
			experienciasExcluidas: [],
			experienciasAdicionadas: [],
			habilidade: '',
			nivelHabilidade: '',
			habilidades: editing ? props.data.habilidades : [],
			habilidadesExcluidas: [],
			habilidadesAdicionadas: [],
			idioma: '',
			nivelIdioma: '',
			idiomas: editing ? props.data.idiomas : [],
			idiomasExcluidos: [],
			idiomasAdicionados: [],
			validations: {
				nome: {
					obrigatorio: false, 
					invalido: false
				},
				descricao: {
					obrigatorio: false, 
					invalido: false
				},
				curso: {
					obrigatorio: false, 
					invalido: false
				},
				localizacaoCurso: {
					obrigatorio: false, 
					invalido: false
				},
				duracaoEmHoras: {
					obrigatorio: false, 
					invalido: false
				},
				educacao: {
					obrigatorio: false, 
					invalido: false
				},
				localizacaoEducacao: {
					obrigatorio: false, 
					invalido: false
				},
				periodoInicialEducacao: {
					obrigatorio: false, 
					invalido: false
				},
				periodoFinalEducacao: {
					obrigatorio: false, 
					invalido: false
				},
				cargo: {
					obrigatorio: false, 
					invalido: false
				},
				periodoInicialExperiencia: {
					obrigatorio: false, 
					invalido: false
				},
				periodoFinalExperiencia: {
					obrigatorio: false, 
					invalido: false
				},
				empresa: {
					obrigatorio: false, 
					invalido: false
				},
				habilidade: {
					obrigatorio: false, 
					invalido: false
				},
				nivelHabilidade: {
					obrigatorio: false
				},
				idioma: {
					obrigatorio: false,
					invalido: false,
				},
				nivelIdioma: {
					obrigatorio: false
				}
			},
			validacaoConcluida: false,
			created: false
		}

		this.handleOnChange = this.handleOnChange.bind(this);
    	this.handleFormSubmit = this.handleFormSubmit.bind(this);
    	this.handleValidations = this.handleValidations.bind(this);
    	this.validacaoRegex = this.validacaoRegex.bind(this);
    	this.checkValidations = this.checkValidations.bind(this);
    	this.handleOnBlur = this.handleOnBlur.bind(this);
    	this.clearForm = this.clearForm.bind(this);

    	this.handleAddOrEditCursos = this.handleAddOrEditCursos.bind(this);
    	this.handleEditCurso = this.handleEditCurso.bind(this);
    	this.handleDeleteCurso = this.handleDeleteCurso.bind(this);
		
    	this.handleAddOrEditEducacao = this.handleAddOrEditEducacao.bind(this);
		this.handleEditEducacao = this.handleEditEducacao.bind(this);
    	this.handleDeleteEducacao = this.handleDeleteEducacao.bind(this);
		
    	this.handleAddOrEditHabilidades = this.handleAddOrEditHabilidades.bind(this);
		this.handleEditHabilidades = this.handleEditHabilidades.bind(this);
    	this.handleDeleteHabilidades = this.handleDeleteHabilidades.bind(this);
		
    	this.handleAddOrEditExperiencias = this.handleAddOrEditExperiencias.bind(this);
		this.handleEditExperiencias = this.handleEditExperiencias.bind(this);
    	this.handleDeleteExperiencias = this.handleDeleteExperiencias.bind(this);

    	this.handleAddOrEditIdiomas = this.handleAddOrEditIdiomas.bind(this);
		this.handleEditIdiomas = this.handleEditIdiomas.bind(this);
    	this.handleDeleteIdiomas = this.handleDeleteIdiomas.bind(this);
	}

	handleOnBlur(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
	}

	handleEditEducacao(index, item) {
		this.setState({
			editingEducacaoIndex: index,
			editingField: true,
			educacao: item.educacao,
			localizacaoEducacao: item.localizacao,
			periodoInicialEducacao: item.periodoinicial,
			periodoFinalEducacao: item.periodofinal
		})
	}

	handleDeleteEducacao(index, educacao) {
		const educacaoObj = this.state.educacaoArr
		educacaoObj.splice(index, 1)
		this.setState({
			educacaoArr: educacaoObj
		})

		if (this.props.edit) {
			this.setState({
				educacaoExcluidos: [this.state.educacaoExcluidos, educacao]
			})
		}
	}

	handleEditCurso(index, item) {
		this.setState({
			editingCursosIndex: index,
			editingField: true,
			curso: item.curso,
			localizacaoCurso: item.localizacao,
			duracaoEmHoras: item.duracaoemhoras
		})
	}

	handleDeleteCurso(index, curso) {
		const cursosObj = this.state.cursos
		cursosObj.splice(index, 1)
		this.setState({
			cursos: cursosObj
		})

		if (this.props.edit) {
			this.setState({
				cursosExcluidos: [this.state.cursosExcluidos, curso]
			})
		}
	}

	handleEditExperiencias(index, item) {
		this.setState({
			editingExperienciasIndex: index,
			editingField: true,
			cargo: item.cargo,
			empresa: item.empresa,
			periodoInicialExperiencia: item.periodoinicial,
			periodoFinalExperiencia: item.periodofinal
		})
	}

	handleDeleteExperiencias(index, experiencia) {
		const experienciasObj = this.state.experiencias
		experienciasObj.splice(index, 1)
		
		this.setState({
			experiencias: experienciasObj
		})

		if (this.props.edit) {
			this.setState({
				experienciasExcluidas: [this.state.experienciasExcluidas, experiencia]
			})
		}
	}

	handleEditHabilidades(index, item) {
		this.setState({
			editingHabilidadesIndex: index,
			editingField: true,
			habilidade: item.habilidade,
			nivelHabilidade: item.nivel
		})
	}

	handleDeleteHabilidades(index, habilidade) {
		const habilidadesObj = this.state.habilidades
		habilidadesObj.splice(index, 1)
		this.setState({
			habilidades: habilidadesObj
		})

		if (this.props.edit) {
			this.setState({
				habilidadesExcluidas: [this.state.habilidadesExcluidas, habilidade]
			})
		}
	}

	handleEditIdiomas(index, item) {
		this.setState({
			editingIdiomasIndex: index,
			editingField: true,
			idioma: item.idioma,
			nivelIdioma: item.nivelidioma
		})
	}

	handleDeleteIdiomas(index, idioma) {
		const idiomasObj = this.state.idiomas
		idiomasObj.splice(index, 1)
		this.setState({
			idiomas: idiomasObj
		})

		if (this.props.edit) {
			this.setState({
				idiomasExcluidos: [this.state.idiomasExcluidos, idioma]
			})
		}
	}

	clearForm() {
		this.setState({
			nome: '',
			descricao: '',
			curso: '',
			salario: '',
			localizacaoCurso: '',
			duracaoEmHoras: '',
			cursos: [],
			cursosExcluidos: [],
			cursosAdicionados: [],
			educacao: '',
			localizacaoEducacao: '',
			periodoInicialEducacao: '',
			periodoFinalEducacao: '',
			educacaoArr: [],
			educacaoArrExcluidos: [],
			educacaoArrAdicionados: [],
			cargo: '',
			periodoInicialExperiencia: '',
			periodoFinalExperiencia: '',
			empresa: '',
			experiencias: [],
			experienciasExcluidas: [],
			experienciasAdicionadas: [],
			habilidade: '',
			nivelHabilidade: '',
			habilidades: [],
			habilidadesExcluidas: [],
			habilidadesAdicionadas: [],
			idioma: '',
			nivelIdioma: '',
			idiomas: [],
			idiomasExcluidos: [],
			idiomasAdicionados: [],
		})
	}

	handleFormSubmit(event) {
		event.preventDefault();
		console.log(this.state)

		const data = {
			nome: this.state.nome,
			descricao: this.state.descricao,
			cursos: this.state.cursos,
			educacao: this.state.educacaoArr,
			experiencias: this.state.experiencias,
			habilidades: this.state.habilidades,
			idiomas: this.state.idiomas
		}

		const token = this.props.usuario.token
		const usuarioId = this.props.usuario.usuarioId

		
		if (this.props.edit) {
			const cursos = {
				cursos: this.state.cursos,
				cursosAdicionados: this.state.cursosAdicionados,
				cursosExcluidos: this.state.cursosExcluidos
			}
			const experiencias = {
				experiencias: this.state.experiencias,
				experienciasAdicionadas: this.state.experienciasAdicionadas,
				experienciasExcluidas: this.state.experienciasExcluidas
			}
			const habilidades = {
				habilidades: this.state.habilidades,
				habilidadesAdicionadas: this.state.habilidadesAdicionadas,
				habilidadesExcluidas: this.state.habilidadesExcluidas
			}
			const educacao = {
				educacao: this.state.educacaoArr,
				educacaoAdicionados: this.state.educacaoArrAdicionados,
				educacaoExcluidos: this.state.educacaoArrExcluidos
			}
			const idiomas = {
				idiomas: this.state.idiomas,
				idiomasAdicionados: this.state.idiomasAdicionados,
				idiomasExcluidos: this.state.idiomasExcluidos
			}

			let data = {
				nome: this.state.nome,
				descricao: this.state.descricao,
			}

			data.cursos = cursos
			data.educacao = educacao
			data.habilidades = habilidades
			data.experiencias = experiencias
			data.idiomas = idiomas
			const curriculoId = this.props.data.curriculoId
			const result = editUserCurriculum(curriculoId, token, data)
			if (result) {
				this.props.callback()
				this.clearForm()
			}
		} else {
			const result = registerCurriculum(usuarioId, token, data)
			if (result) {
				this.setState({registered: true})
				this.props.callback()
				this.clearForm()
			} else {
				this.setState({registered: false})
			}
		}
	}

	checkValidations() {

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

		if (name === 'curso') {
			const pattern = /^[a-zA-Z\u00C0-\u00FF 0-9!#-_&']+$/
			this.validacaoRegex(pattern, value, name)
		}
		if (name === 'duracaoEmHoras') {
			const pattern = /^[0-9]+$/
			this.validacaoRegex(pattern, value, name)
		}

		if (name === 'educacao') {
			const pattern = /^[a-zA-Z\u00C0-\u00FF ']+$/
			this.validacaoRegex(pattern, value, name)
		}

		if (name === 'cargo') {
			const pattern = /^[a-zA-Z\u00C0-\u00FF ']+$/
			this.validacaoRegex(pattern, value, name)
		}

		if (name === 'empresa') {
			const pattern = /^[a-zA-Z\u00C0-\u00FF ']+$/
			this.validacaoRegex(pattern, value, name)
		}

		if (name === 'nivelHabilidade') {
			const pattern = /^[a-zA-Z\u00C0-\u00FF ']+$/
			this.validacaoRegex(pattern, value, name)
		}

		if (name === 'idioma') {
			const pattern = /^[a-zA-Z\u00C0-\u00FF ']+$/
			this.validacaoRegex(pattern, value, name)
		}

		if (name === 'nivelIdioma') {
			const pattern = /^[a-zA-Z\u00C0-\u00FF ']+$/
			this.validacaoRegex(pattern, value, name)
		}

		this.setState({
			[name]: value
		})
	}

	handleOnChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.handleValidations(event)
		this.checkValidations();
		
	}

	handleAddOrEditCursos() {

		if (this.props.edit) {
			if (this.state.editingField) {
				const cursosObj = this.state.cursos
				const index = this.state.editingCursosIndex
				cursosObj[index].curso = this.state.curso
				cursosObj[index].localizacao = this.state.localizacaoCurso
				cursosObj[index].duracaoemhoras = this.state.duracaoEmHoras
				this.setState({
					editingField: false,
					editingCursosIndex: 0,
					curso: '',
					localizacaoCurso: '',
					duracaoEmHoras: '',
					cursos: cursosObj
				})
			} else {
				const newCurso = {
					curso: this.state.curso,
					localizacao: this.state.localizacaoCurso,
					duracaoemhoras: this.state.duracaoEmHoras
				}
				this.setState({
					curso: '',
					localizacaoCurso: '',
					duracaoEmHoras: '',
					cursos: [...this.state.cursos, newCurso],
					cursosAdicionados: [...this.state.cursosAdicionados, newCurso]
				})
			}
		} else {
			if (this.state.editingField) {
				const cursosObj = this.state.cursos
				const index = this.state.editingCursosIndex
				cursosObj[index].curso = this.state.curso
				cursosObj[index].localizacao = this.state.localizacaoCurso
				cursosObj[index].duracaoemhoras = this.state.duracaoEmHoras
				this.setState({
					editingField: false,
					editingCursosIndex: 0,
					curso: '',
					localizacaoCurso: '',
					duracaoEmHoras: '',
					cursos: cursosObj
				})
			} else {
				const newCurso = {
					curso: this.state.curso,
					localizacao: this.state.localizacaoCurso,
					duracaoemhoras: this.state.duracaoEmHoras
				}
				this.setState({
					curso: '',
					localizacaoCurso: '',
					duracaoEmHoras: '',
					cursos: [...this.state.cursos, newCurso],
				})
			}
		}
	}

	handleAddOrEditEducacao() {
		if (this.props.edit) {
			if (this.state.editingField) {
				const educacaoObj = this.state.educacaoArr
				const index = this.state.editingEducacaoIndex
				educacaoObj[index].educacao = this.state.educacao
				educacaoObj[index].localizacao = this.state.localizacaoEducacao
				educacaoObj[index].periodoinicial = this.state.periodoInicialEducacao
				educacaoObj[index].periodofinal = this.state.periodoFinalEducacao
				this.setState({
					editingField: false,
					editingEducacaoIndex: 0,
					educacao: '',
					localizacaoEducacao: '',
					periodoInicialEducacao: '',
					periodoFinalEducacao: '',
					educacaoArr: educacaoObj
				})
			} else {
				const newEducacao = {
					educacao: this.state.educacao,
					localizacao: this.state.localizacaoEducacao,
					periodoinicial: this.state.periodoInicialEducacao,
					periodofinal: this.state.periodoFinalEducacao,
				}
				this.setState({
					educacao: '',
					localizacaoEducacao: '',
					periodoInicialEducacao: '',
					periodoFinalEducacao: '',
					educacaoArr: [...this.state.educacaoArr, newEducacao],
					educacaoArrAdicionados: [...this.state.educacaoArrAdicionados, newEducacao]
				})
			}
		} else {
			if (this.state.editingField) {
				const educacaoObj = this.state.educacaoArr
				const index = this.state.editingEducacaoIndex
				educacaoObj[index].educacao = this.state.educacao
				educacaoObj[index].localizacao = this.state.localizacaoEducacao
				educacaoObj[index].periodoinicial = this.state.periodoInicialEducacao
				educacaoObj[index].periodofinal = this.state.periodoFinalEducacao
				this.setState({
					editingField: false,
					editingEducacaoIndex: 0,
					educacao: '',
					localizacaoEducacao: '',
					periodoInicialEducacao: '',
					periodoFinalEducacao: '',
					educacaoArr: educacaoObj
				})
			} else {
				const newEducacao = {
					educacao: this.state.educacao,
					localizacao: this.state.localizacaoEducacao,
					periodoinicial: this.state.periodoInicialEducacao,
					periodofinal: this.state.periodoFinalEducacao,
				}
				this.setState({
					educacao: '',
					localizacaoEducacao: '',
					periodoInicialEducacao: '',
					periodoFinalEducacao: '',
					educacaoArr: [...this.state.educacaoArr, newEducacao],
					educacaoArrAdicionados: [...this.state.educacaoArrAdicionados, newEducacao]
				})
			}
		}
	}

	handleAddOrEditExperiencias() {
		if (this.props.edit) {
			if (this.state.editingField) {
				const experienciasObj = this.state.experiencias
				const index = this.state.editingExperienciasIndex
				experienciasObj[index].empresa = this.state.empresa
				experienciasObj[index].cargo = this.state.cargo
				experienciasObj[index].periodoinicial = this.state.periodoInicialExperiencia
				experienciasObj[index].periodofinal = this.state.periodoFinalExperiencia
				this.setState({
					editingField: false,
					editingExperienciasIndex: 0,
					empresa: '',
					cargo: '',
					periodoInicialExperiencia: '',
					periodoFinalExperiencia: '',
					experiencias: experienciasObj
				})
			} else {
				const newExperiencias = {
					empresa: this.state.empresa,
					cargo: this.state.cargo,
					periodoinicial: this.state.periodoInicialExperiencia,
					periodofinal: this.state.periodoFinalExperiencia
				}
				this.setState({
					empresa: '',
					cargo: '',
					periodoInicialExperiencia: '',
					periodoFinalExperiencia: '',
					experiencias: [...this.state.experiencias, newExperiencias],
					experienciasAdicionadas: [...this.state.experienciasAdicionadas, newExperiencias]
				})
			}
		} else {
			if (this.state.editingField) {
				const experienciasObj = this.state.experiencias
				const index = this.state.editingExperienciasIndex
				experienciasObj[index].empresa = this.state.empresa
				experienciasObj[index].cargo = this.state.cargo
				experienciasObj[index].periodoinicial = this.state.periodoInicialExperiencia
				experienciasObj[index].periodofinal = this.state.periodoFinalExperiencia
				this.setState({
					editingField: false,
					editingExperienciasIndex: 0,
					empresa: '',
					cargo: '',
					periodoInicialExperiencia: '',
					periodoFinalExperiencia: '',
					experiencias: experienciasObj
				})
			} else {
				const newExperiencia = {
					empresa: this.state.empresa,
					cargo: this.state.cargo,
					periodoinicial: this.state.periodoInicialExperiencia,
					periodofinal: this.state.periodoFinalExperiencia
				}
				this.setState({
					empresa: '',
					cargo: '',
					periodoInicialExperiencia: '',
					periodoFinalExperiencia: '',
					experiencias: [...this.state.experiencias, newExperiencia]
				})
			}
		}
	}

	handleAddOrEditIdiomas() {

		if (this.props.edit) {
			if (this.state.editingField) {
				const idiomasObj = this.state.idiomas
				const index = this.state.editingIdiomasIndex
				idiomasObj[index].idioma = this.state.idioma
				idiomasObj[index].nivel = this.state.nivelIdioma
				this.setState({
					editingField: false,
					editingIdiomasIndex: 0,
					nivelIdioma: '',
					idioma: '',
					idiomas: idiomasObj
				})
			} else {
				const newIdioma = {
					idioma: this.state.idioma,
					nivel: this.state.nivelIdioma
				}
				this.setState({
					idioma: '',
					nivelIdioma: '',
					idiomas: [...this.state.idiomas, newIdioma],
					idiomasAdicionados: [...this.state.idiomasAdicionados, newIdioma]
				})
			}
		} else {
			if (this.state.editingField) {
				const idiomasObj = this.state.idiomas
				const index = this.state.editingIdiomasIndex
				idiomasObj[index].idioma = this.state.idioma
				idiomasObj[index].nivel = this.state.nivelIdioma
				this.setState({
					editingField: false,
					editingIdiomasIndex: 0,
					idioma: '',
					nivelIdioma: '',
					idiomas: idiomasObj
				})
			} else {
				const newIdioma = {
					idioma: this.state.idioma,
					nivel: this.state.nivelIdioma
				}
				this.setState({
					idioma: '',
					nivelIdioma: '',
					idiomas: [...this.state.idiomas, newIdioma]
				})
			}
		}
	}

	handleAddOrEditHabilidades() {
		if (this.props.edit) {
			if (this.state.editingField) {
				const habilidadesObj = this.state.habilidades
				const index = this.state.editingHabilidadesIndex
				habilidadesObj[index].habilidade = this.state.habilidade
				habilidadesObj[index].nivel = this.state.nivelHabilidade
				this.setState({
					editingField: false,
					editingHabilidadesIndex: 0,
					nivelHabilidade: '',
					habilidade: '',
					habilidades: habilidadesObj
				})
			} else {
				const newHabilidade = {
					habilidade: this.state.habilidade,
					nivel: this.state.nivelHabilidade
				}
				this.setState({
					habilidade: '',
					nivelHabilidade: '',
					habilidades: [...this.state.habilidades, newHabilidade],
					habilidadesAdicionadas: [...this.state.habilidadesAdicionadas, newHabilidade]
				})
			}
		} else {
			if (this.state.editingField) {
				const habilidadesObj = this.state.habilidades
				const index = this.state.editingHabilidadesIndex
				habilidadesObj[index].habilidade = this.state.habilidade
				habilidadesObj[index].nivel = this.state.nivelHabilidade
				this.setState({
					editingField: false,
					editingHabilidadesIndex: 0,
					habilidade: '',
					nivelHabilidade: '',
					habilidades: habilidadesObj
				})
			} else {
				const newHabilidade = {
					habilidade: this.state.habilidade,
					nivel: this.state.nivelHabilidade
				}
				this.setState({
					habilidade: '',
					nivelHabilidade: '',
					habilidades: [...this.state.habilidades, newHabilidade]
				})
			}
		}
	}

	render() {
		const listagemCursos = this.state.cursos.map((item, index) => 
				<li key={index} className="listagem-item">
					<div className="listagem-item__subitem">
						<div className="listagem-item__subitem">
							<span className="listagem-item__subitem-label">Curso:</span>
							<span className="listagem-item__subitem-value">{item.curso}</span>
						</div>
						<div className="listagem-item__subitem">
							<span className="listagem-item__subitem-label">Localização:</span>
							<span className="listagem-item__subitem-value">{item.localizacao}</span>
						</div>
						<div className="listagem-item__subitem">
							<span className="listagem-item__subitem-label">Duração em Horas:</span>
							<span className="listagem-item__subitem-value">{item.duracaoemhoras}h</span>
						</div>
					</div>
					<div className="buttons">
						<button 
							disabled={this.state.editingField}
							type="button"
							onClick={this.handleEditCurso.bind(this, index, item)}
							className="button button--yellow">Editar</button>
						<button 
							disabled={this.state.editingField}
							type="button"
							onClick={this.handleDeleteCurso.bind(this, index, item)}
							className="button button--red">Deletar</button>
					</div>
				</li>
			);

		const listagemEducacao = this.state.educacaoArr.map((item, index) => 
			<li key={index} className="listagem-item">
				<div className="listagem-item__subitem">
					<div className="listagem-item__subitem">
						<span className="listagem-item__subitem-label">Educação:</span>
						<span className="listagem-item__subitem-value">{item.educacao}</span>
					</div>
					<div className="listagem-item__subitem">
						<span className="listagem-item__subitem-label">Localização:</span>
						<span className="listagem-item__subitem-value">{item.localizacao}</span>
					</div>
					<div className="listagem-item__subitem">
						<span className="listagem-item__subitem-label">Período Inicial:</span>
						<span className="listagem-item__subitem-value">{item.periodoinicial}</span>
					</div>
					<div className="listagem-item__subitem">
						<span className="listagem-item__subitem-label">Período Final:</span>
						<span className="listagem-item__subitem-value">{item.periodofinal}</span>
					</div>
				</div>
				<div className="buttons">
					<button 
						disabled={this.state.editingField}
						type="button"
						onClick={this.handleEditEducacao.bind(this, index, item)}
						className="button button--yellow">Editar</button>
					<button
						disabled={this.state.editingField} 
						type="button"
						onClick={this.handleDeleteEducacao.bind(this, index, item)}
						className="button button--red">Deletar</button>
				</div>
			</li>
		);

		const listagemExperiencias = this.state.experiencias.map((item, index) => 
			<li key={index} className="listagem-item">
				<div className="listagem-item__subitem">
					<div className="listagem-item__subitem">
						<span className="listagem-item__subitem-label">Cargo:</span>
						<span className="listagem-item__subitem-value">{item.cargo}</span>
					</div>
					<div className="listagem-item__subitem">
						<span className="listagem-item__subitem-label">Período Inicial:</span>
						<span className="listagem-item__subitem-value">{item.periodoinicial}</span>
					</div>
					<div className="listagem-item__subitem">
						<span className="listagem-item__subitem-label">Período Final:</span>
						<span className="listagem-item__subitem-value">{item.periodofinal}</span>
					</div>
					<div className="listagem-item__subitem">
						<span className="listagem-item__subitem-label">Empresa:</span>
						<span className="listagem-item__subitem-value">{item.empresa}</span>
					</div>
				</div>
				<div className="buttons">
					<button
						disabled={this.state.editingField}
						type="button" 
						onClick={this.handleEditExperiencias.bind(this, index, item)}
						className="button button--yellow">Editar</button>
					<button
						disabled={this.state.editingField}
						type="button" 
						onClick={this.handleDeleteExperiencias.bind(this, index, item)}
						className="button button--red">Deletar</button>
				</div>
			</li>
		);

		const listagemHabilidades = this.state.habilidades.map((item, index) => 
			<li key={index} className="listagem-item">
				<div className="listagem-item__subitem">
					<div className="listagem-item__subitem">
						<span className="listagem-item__subitem-label">Habilidade:</span>
						<span className="listagem-item__subitem-value">{item.habilidade}</span>
					</div>
					<div className="listagem-item__subitem">
						<span className="listagem-item__subitem-label">Nível:</span>
						<span className="listagem-item__subitem-value">{item.nivel}</span>
					</div>
				</div>
				<div className="buttons">
					<button 
						disabled={this.state.editingField}
						type="button"
						onClick={this.handleEditHabilidades.bind(this, index, item)}
						className="button button--yellow">Editar</button>
					<button
						disabled={this.state.editingField}
						type="button" 
						onClick={this.handleDeleteHabilidades.bind(this, index, item)}
						className="button button--red">Deletar</button>
				</div>
			</li>
		);

		const listagemIdiomas = this.state.idiomas.map((item, index) => 
			<li key={index} className="listagem-item">
				<div className="listagem-item__subitem">
					<div className="listagem-item__subitem">
						<span className="listagem-item__subitem-label">Idioma:</span>
						<span className="listagem-item__subitem-value">{item.idioma}</span>
					</div>
					<div className="listagem-item__subitem">
						<span className="listagem-item__subitem-label">Nível:</span>
						<span className="listagem-item__subitem-value">{item.nivel}</span>
					</div>
				</div>
				<div className="buttons">
					<button 
						disabled={this.state.editingField}
						type="button"
						onClick={this.handleEditIdiomas.bind(this, index, item)}
						className="button button--yellow">Editar</button>
					<button
						disabled={this.state.editingField}
						type="button" 
						onClick={this.handleDeleteIdiomas.bind(this, index, item)}
						className="button button--red">Deletar</button>
				</div>
			</li>
		);

		return (
			<form 
				onSubmit={this.handleFormSubmit}
				id="tipoCandidato" 
				className="form">
				<div className="section section-1">
					<h2 className="subtitle">Curriculo</h2>
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
						<input
							name="descricao"
							value={this.state.descricao}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="text"
							id="inp-descricao" />
						<div className="error-messages">
							{this.state.validations.descricao.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.descricao.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
				</div>
				<div className="section section-2">
					<h2 className="subtitle">Cursos</h2>
					{this.state.cursos.length > 0 ? <div className="lista-subitem">
						<p className="section-name">Seus cursos:</p>
						<ul className="listagem">
							{listagemCursos}
						</ul>
					</div> : '' }
					<label htmlFor="inp-curso" className="label">
						Curso
						<input
							name="curso"
							value={this.state.curso}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="text"
							id="inp-curso" />
						<div className="error-messages">
							{this.state.validations.curso.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.curso.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<label htmlFor="inp-localizacaoCurso" className="label">
						Localização
						<input
							name="localizacaoCurso"
							value={this.state.localizacaoCurso}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="text"
							id="inp-localizacaoCurso" />
						<div className="error-messages">
							{this.state.validations.localizacaoCurso.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.localizacaoCurso.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<label htmlFor="inp-duracaoEmHoras" className="label">
						Duracao Em Horas
						<input
							name="duracaoEmHoras"
							value={this.state.duracaoEmHoras}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="text"
							id="inp-duracaoEmHoras" />
						<div className="error-messages">
							{this.state.validations.duracaoEmHoras.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.duracaoEmHoras.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<div className="buttons">
						<button
							disabled={
								!this.state.curso || 
								!this.state.localizacaoCurso || 
								!this.state.duracaoEmHoras
							}
							onClick={this.handleAddOrEditCursos} 
							type="button" 
							className="button">
							{this.state.editingField ? 'Editar Curso' : 'Adicionar Curso'}
						</button>
					</div>
				</div>
				<div className="section section-3">
					<h2 className="subtitle">Educação</h2>
					{this.state.educacaoArr.length > 0 ? <div className="lista-subitem">
						<p className="section-name">Sua educação:</p>
						<ul className="listagem">
							{listagemEducacao}
						</ul>
					</div> : '' }
					<label htmlFor="inp-educacao" className="label">
						Educação
						<input
							name="educacao"
							value={this.state.educacao}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="text"
							id="inp-educacao" />
						<div className="error-messages">
							{this.state.validations.educacao.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.educacao.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<label htmlFor="inp-localizacaoEducacao" className="label">
						Localização
						<input
							name="localizacaoEducacao"
							value={this.state.localizacaoEducacao}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="text"
							id="inp-localizacaoEducacao" />
						<div className="error-messages">
							{this.state.validations.localizacaoEducacao.obrigatorio ? <span 	className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.localizacaoEducacao.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<label htmlFor="inp-periodoInicialEducacao" className="label">
						Período Inicial
						<input
							name="periodoInicialEducacao"
							value={this.state.periodoInicialEducacao}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="date"
							id="inp-periodoInicialEducacao" />
						<div className="error-messages">
							{this.state.validations.periodoInicialEducacao.obrigatorio ? <span 	className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.periodoInicialEducacao.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<label htmlFor="inp-periodoFinalEducacao" className="label">
						Período Final
						<input
							name="periodoFinalEducacao"
							value={this.state.periodoFinalEducacao}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="date"
							id="inp-periodoFinalEducacao" />
						<div className="error-messages">
							{this.state.validations.periodoFinalEducacao.obrigatorio ? <span 	className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.periodoFinalEducacao.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<div className="buttons">
						<button
							disabled={!this.state.educacao || !this.state.periodoInicialEducacao || !this.state.periodoFinalEducacao || !this.state.localizacaoEducacao}
							onClick={this.handleAddOrEditEducacao} 
							type="button" 
							className="button">
							{this.state.editingField ? 'Editar Educação' : 'Adicionar Educação'}
						</button>
					</div>
				</div>
				<div className="section section-4">
					<h2 className="subtitle">Experiências</h2>
					{this.state.experiencias.length > 0 ? <div className="lista-subitem">
						<p className="section-name">Suas experiências:</p>
						<ul className="listagem">
							{listagemExperiencias}
						</ul>
					</div> : '' }
					<label htmlFor="inp-cargo" className="label">
						Experiência
						<input
							name="cargo"
							value={this.state.cargo}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="text" 
							id="inp-cargo" />
						<div className="error-messages">
							{this.state.validations.cargo.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.cargo.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<label htmlFor="inp-periodoInicialExperiencia" className="label">
						Período Inicial
						<input
							name="periodoInicialExperiencia"
							value={this.state.periodoInicialExperiencia}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="date"
							id="inp-periodoInicialExperiencia" />
						<div className="error-messages">
							{this.state.validations.periodoInicialExperiencia.obrigatorio ? <span 	className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.periodoInicialExperiencia.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<label htmlFor="inp-periodoFinalExperiencia" className="label">
						Período Final
						<input
							name="periodoFinalExperiencia"
							value={this.state.periodoFinalExperiencia}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="date"
							id="inp-periodoFinalExperiencia" />
						<div className="error-messages">
							{this.state.validations.periodoFinalExperiencia.obrigatorio ? <span 	className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.periodoFinalExperiencia.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<label htmlFor="inp-empresa" className="label">
						Empresa
						<input
							name="empresa"
							value={this.state.empresa}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="text"
							id="inp-empresa" />
						<div className="error-messages">
							{this.state.validations.empresa.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.empresa.naoConfere ? <span className="error-message">Senhas não conferem</span> : '' }
						</div>
					</label>
					<div className="buttons">
						<button
							disabled={!this.state.cargo || !this.state.periodoInicialExperiencia || !this.state.periodoFinalExperiencia || !this.state.empresa}
							onClick={this.handleAddOrEditExperiencias} 
							type="button" 
							className="button">
							{this.state.editingField ? 'Editar Experiência' : 'Adicionar Experiência'}
						</button>
					</div>
				</div>
				<div className="section section-5">
					<h2 className="subtitle">Habilidades</h2>
					{this.state.habilidades.length > 0 ? <div className="lista-subitem">
						<p className="section-name">Suas habilidades:</p>
						<ul className="listagem">
							{listagemHabilidades}
						</ul>
					</div> : '' }
					<label htmlFor="inp-habilidade" className="label">
						Habilidade
						<input
							name="habilidade"
							value={this.state.habilidade}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange} 
							type="text" 
							id="inp-habilidade" />
						<div className="error-messages">
							{this.state.validations.habilidade.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.habilidade.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<div className="selecao">
						<p className="section-name">Nível Habilidade</p>
						<select
							name="nivelHabilidade"
							value={this.state.nivelHabilidade}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange} 
							className='select' 
							id="sel-nivelHabilidade">
							<option value="selecione">Selecione</option>
							<option value="Básico">Básico</option>
							<option value="Intermediário">Intermediário</option>
							<option value="Avançado">Avançado</option>
						</select>
						<div className="error-messages">
							{this.state.validations.nivelHabilidade.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
						</div>
					</div>
					<div className="buttons">
						<button
							disabled={!this.state.habilidade || !this.state.nivelHabilidade}
							onClick={this.handleAddOrEditHabilidades} 
							type="button" 
							className="button">
							{this.state.editingField ? 'Editar Habilidade' : 'Adicionar Habilidade'}
						</button>
					</div>
				</div>
				<div className="section section-6">
					<h2 className="subtitle">Idiomas</h2>
					{this.state.idiomas.length > 0 ? <div className="lista-subitem">
						<p className="section-name">Seus idiomas:</p>
						<ul className="listagem">
							{listagemIdiomas}
						</ul>
					</div> : '' }
					<label htmlFor="inp-idioma" className="label">
						Idiomas
						<input
							name="idioma"
							value={this.state.idioma}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange} 
							type="text" 
							id="inp-idioma" />
						<div className="error-messages">
							{this.state.validations.idioma.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.idioma.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<div className="selecao">
						<p className="section-name">Nível Idioma</p>
						<select
							name="nivelIdioma"
							value={this.state.nivelIdioma}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange} 
							className='select' 
							id="sel-nivelIdioma">
							<option value="selecione">Selecione</option>
							<option value="Básico">Básico</option>
							<option value="Intermediário">Intermediário</option>
							<option value="Avançado">Avançado</option>
						</select>
						<div className="error-messages">
							{this.state.validations.nivelIdioma.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
						</div>
					</div>
					<div className="buttons">
						<button
							disabled={!this.state.idioma || !this.state.nivelIdioma}
							onClick={this.handleAddOrEditIdiomas} 
							type="button" 
							className="button">
							{this.state.editingField ? 'Editar Idioma' : 'Adicionar Idioma'}
						</button>
					</div>
				</div>
				<div className="buttons">
					<button
						disabled={!this.state.nome || !this.state.descricao} 
						type="submit" 
						className="button">
						{this.props.edit ? 'Editar Currículo' : 'Criar Currículo'}
					</button>
				</div>
			</form>
		)
	}
}

export default CurriculoFormulario