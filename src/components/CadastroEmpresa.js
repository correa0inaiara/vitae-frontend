import React from 'react'
import { Navigate } from 'react-router-dom';
import { login, registerUser } from '../data/ApiService';
import Mensagem from './Mensagem';

class CadastroEmpresa extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			mensagemDeErro: '',
			logadoComGoogle: false,
			nomeEmpresa: '',
			cnpj: '',
			ramo: '',
			numFuncionarios: '',
			telefone: '',
			celular: '',
			email: '',
			website: '',
			senha: '',
			confirmarSenha: '',
			logradouro: '',
			numero: '',
			bairro: '',
			cidade: '',
			estado: '',
			pais: 'Brasil',
			cep: '',
			perfil: '',
			nome: '',
			redesSociais: [],
			validations: {
				nomeEmpresa: {
					obrigatorio: false, 
					invalido: false
				},
				cnpj: {
					obrigatorio: false, 
					invalido: false
				},
				ramo: {
					obrigatorio: false, 
					invalido: false
				},
				numFuncionarios: {
					obrigatorio: false, 
					invalido: false
				},
				telefone: {
					obrigatorio: false, 
					invalido: false
				},
				celular: {
					obrigatorio: false, 
					invalido: false
				},
				email: {
					obrigatorio: false, 
					invalido: false
				},
				senha: {
					obrigatorio: false, 
					naoConfere: false
				},
				confirmarSenha: {
					obrigatorio: false, 
					naoConfere: false
				},
				website: {
					obrigatorio: false, 
					invalido: false
				},
				logradouro: {
					obrigatorio: false, 
					invalido: false
				},
				numero: {
					obrigatorio: false, 
					invalido: false
				},
				bairro: {
					obrigatorio: false, 
					invalido: false
				},
				cidade: {
					obrigatorio: false, 
					invalido: false
				},
				estado: {
					obrigatorio: false
				},
				cep: {
					obrigatorio: false,
					invalido: false
				},
				perfil: {
					obrigatorio: false, 
					invalido: false
				},
			},
			validacaoConcluida: false,
			registered: false
		}

		this.handleOnChange = this.handleOnChange.bind(this);
    	this.handleFormSubmit = this.handleFormSubmit.bind(this);
    	this.handleAddRedeSocial = this.handleAddRedeSocial.bind(this);
    	this.handleValidations = this.handleValidations.bind(this);
    	this.validacaoRegex = this.validacaoRegex.bind(this);
    	this.checkValidations = this.checkValidations.bind(this);
    	this.handleOnBlur = this.handleOnBlur.bind(this);

        this.storageChanged = this.storageChanged.bind(this);
	}

	componentDidMount() {
		window.addEventListener('storage', this.storageChanged);
	}

	componentWillUnmount() {
		window.removeEventListener('storage', this.storageChanged);
	}

	storageChanged(e) {
		const _user = JSON.parse(localStorage.getItem("user"))
		if (_user && _user.loginSocialToken) {
			const name = _user.loginSocialToken.name
			const email = _user.loginSocialToken.email
			this.setState((state) => {
				return {
					nomeEmpresa: name,
					email: email,
					logadoComGoogle: true
				}
			})
			this.setState((item) => {
				return item.validations.nomeEmpresa.obrigatorio = false
			})
			this.setState((item) => {
				return item.validations.nomeEmpresa.invalido = false
			})
			this.setState((item) => {
				return item.validations.email.obrigatorio = false
			})
			this.setState((item) => {
				return item.validations.email.invalido = false
			})
		} else {
			this.setState((state) => {
				return {
					nomeEmpresa: '',
					email: '',
					logadoComGoogle: false
				}
			})
		}
    }

	handleOnBlur(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		if (name === 'senha' || name === 'confirmarSenha') {
			if (this.state.senha === this.state.confirmarSenha) {
				this.setState((item) => {
					return item.validations.senha.naoConfere = false
				})
				this.setState((item) => {
					return item.validations.confirmarSenha.naoConfere = false
				})
			} else {
				this.setState((item) => {
					return item.validations.senha.naoConfere = true
				})
				this.setState((item) => {
					return item.validations.confirmarSenha.naoConfere = true
				})	
			}
		}

		if (value && value !== 'selecione') {
			this.setState((item) => {
				return item.validations[name].obrigatorio = false
			})
		} else {
			this.setState((item) => {
				return item.validations[name].obrigatorio = true
			})
		}
	}

	handleFormSubmit(event) {
		
		registerUser(this.state, 'Empresa')
		.then(res => {
        	if (res.ok) {
				if (this.state.logadoComGoogle) {
					login({email: this.state.email, senha: null, loginSocial: true})
					.then(async res => {
						if (res.ok) {
							const loginResult = await res.json();
							const _user = JSON.parse(localStorage.getItem("user"))
							if (_user) {
								const user = {
									token: loginResult.token,
									usuarioId: loginResult.usuarioId,
									tipoUsuario: loginResult.tipoUsuario,
									loginSocialToken: _user.loginSocialToken
								} 
								localStorage.setItem("user", JSON.stringify(user))
								this.props.redirect()
							}
						} else {
							res.text().then(text => { 
								this.setState({
									mensagemDeErro: text
								})
							})
						}
					})
					.catch(err =>  {
						err.text().then(text => { 
							this.setState({
								mensagemDeErro: text
							})
						})
					})
				} else {
					login({email: this.state.email, senha: this.state.senha, loginSocial: false})
					.then(async res => {
						if (res.ok) {
							const loginResult = await res.json();
							const user = {
								token: loginResult.token,
								usuarioId: loginResult.usuarioId,
								tipoUsuario: loginResult.tipoUsuario
							} 
							localStorage.setItem("user", JSON.stringify(user))
							this.props.redirect()
						} else {
							res.text().then(text => { 
								this.setState({
									mensagemDeErro: text
								})
							})
						}
					})
					.catch(err => {
						this.setState({
							mensagemDeErro: err
						})
					})
				}
				this.setState({
					registered: true,
					mensagemDeErro: ''
				})
			} else {
				res.text().then(text => { 
					this.setState({
						mensagemDeErro: text
					})
				})
			}
		})
		.catch(err => {
        	this.setState({
				registered: false,
				mensagemDeErro: err
			})
		})

		event.preventDefault();
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

		const passouNaoConf = Object.values(this.state.validations).find(item => {
			if (typeof item?.naoConfere !== 'undefined') {
				if (item.naoConfere) return item.naoConfere
			}
		})

		if (typeof passouObg === 'undefined' &&
			typeof passouInv === 'undefined' &&
			typeof passouNaoConf === 'undefined') {
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

		if (name === 'nomeEmpresa') {
			const pattern = /^[a-zA-Z\u00C0-\u00FF &']+$/
			this.validacaoRegex(pattern, value, name)
		}

		if (name === 'cnpj') {
			const pattern = /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}\-?\d{2}$/
			this.validacaoRegex(pattern, value, name)
			value = value.replace(/[^0-9]/g, "")
		}

		if (name === 'ramo') {
			const pattern = /^[a-zA-Z\u00C0-\u00FF ']+$/
			this.validacaoRegex(pattern, value, name)
		}

		if (name === 'numFuncionarios') {
			const pattern = /^[0-9]+$/
			this.validacaoRegex(pattern, value, name)
		}

		if (name === 'telefone') {
			const pattern = /^\(?[0-9]{2}\)? ?[0-9]{4}\-?[0-9]{4}$/
			this.validacaoRegex(pattern, value, name)
			value = value.replace(/[^0-9]/g, "")
		}

		if (name === 'celular') {
			const pattern = /^\(?[0-9]{2}\)? ?[0-9]{5}\-?[0-9]{4}$/
			this.validacaoRegex(pattern, value, name)
			value = value.replace(/[^0-9]/g, "")
		}

		if (name === 'email') {
			const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
			this.validacaoRegex(pattern, value, name)
		}

		if (name === 'website') {
			const pattern = /^((http)(s?)(:\/\/))?(www\.)?([a-zA-Z]+)(\.[a-zA-Z]+)+$/
			this.validacaoRegex(pattern, value, name)
		}

		if (name === 'logradouro') {
			const pattern = /^[a-zA-Z\u00C0-\u00FF ']+$/
			this.validacaoRegex(pattern, value, name)
		}

		if (name === 'numero') {
			const pattern = /^[0-9]+$/
			this.validacaoRegex(pattern, value, name)
		}

		if (name === 'bairro') {
			const pattern = /^[a-zA-Z\u00C0-\u00FF ']+$/
			this.validacaoRegex(pattern, value, name)
		}

		if (name === 'cidade') {
			const pattern = /^[a-zA-Z\u00C0-\u00FF ']+$/
			this.validacaoRegex(pattern, value, name)
		}

		if (name === 'cep') {
			const pattern = /^([0-9]){5}(\-)?([0-9]){3}$/
			this.validacaoRegex(pattern, value, name)
			value = value.replace(/[^0-9]/g, "")
		}

		if (name === 'perfil') {
			const pattern = /^@?[a-zA-Z-_.0-9]+$/
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

	handleAddRedeSocial() {
		const newRedeSocial = {
			nomeDaRedeSocial: this.state.nome,
			perfilUsuario: this.state.perfil
		}
		this.setState({
			perfil: '',
			nome: '',
			redesSociais: [...this.state.redesSociais, newRedeSocial]
		})
	}

	render() {
		const listagem = this.state.redesSociais.map((redeSocial, index) => 
			<li key={index} className="listagem-item">
				<p className="nome-rede">{redeSocial.nomeDaRedeSocial}:</p>
				<p className="nome-perfil">{redeSocial.perfilUsuario}</p>
			</li>
		);

		return (
			<form 
				onSubmit={this.handleFormSubmit}
				id="tipoEmpresa" 
				className="form">
				<div className="section section-1">
					<h2 className="subtitle">Informações da Empresa</h2>
					<label htmlFor="inp-empresa" className="label">
						Empresa
						<input
							disabled={this.state.logadoComGoogle}
							name="nomeEmpresa"
							value={this.state.nomeEmpresa}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="text"
							id="inp-empresa" />
						<div className="error-messages">
							{this.state.validations.nomeEmpresa.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.nomeEmpresa.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<label htmlFor="inp-cnpj" className="label">
						CNPJ
						<input
							name="cnpj"
							value={this.state.cnpj}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="text"
							id="inp-cnpj" />
						<div className="error-messages">
							{this.state.validations.cnpj.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.cnpj.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<label htmlFor="inp-ramo" className="label">
						Ramo da Empresa
						<input
							name="ramo"
							value={this.state.ramo}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="text"
							id="inp-ramo" />
						<div className="error-messages">
							{this.state.validations.ramo.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.ramo.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<label htmlFor="inp-ramo" className="label">
						Número de Funcionário
						<input
							name="numFuncionarios"
							value={this.state.numFuncionarios}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="text"
							id="inp-numFuncionarios" />
						<div className="error-messages">
							{this.state.validations.numFuncionarios.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.numFuncionarios.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
				</div>
				<div className="section section-2">
					<h2 className="subtitle">Informações de Contato</h2>
					<label htmlFor="inp-telefone" className="label">
						Telefone
						<input
							name="telefone"
							value={this.state.telefone}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="text"
							id="inp-telefone" />
						<div className="error-messages">
							{this.state.validations.telefone.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.telefone.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<label htmlFor="inp-celular" className="label">
						Celular
						<input
							name="celular"
							value={this.state.celular}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="text"
							id="inp-celular" />
						<div className="error-messages">
							{this.state.validations.celular.obrigatorio ? <span 	className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.celular.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<label htmlFor="inp-website" className="label">
						Website
						<input
							name="website"
							value={this.state.website}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="text"
							id="inp-website" />
						<div className="error-messages">
							{this.state.validations.website.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.website.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
				</div>
				<div className="section section-3">
					<h2 className="subtitle">Informações de Login</h2>
					<label htmlFor="inp-emailLogin" className="label">
						E-mail
						<input
							disabled={this.state.logadoComGoogle}
							name="email"
							value={this.state.email}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="email" 
							id="inp-emailLogin" />
						<div className="error-messages">
							{this.state.validations.email.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.email.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<label htmlFor="inp-senha" className="label">
						Senha
						<input
							disabled={this.state.logadoComGoogle}
							name="senha"
							value={this.state.senha}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="password"
							id="inp-senha" />
						<div className="error-messages">
							{this.state.validations.senha.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.senha.naoConfere ? <span className="error-message">Senhas não conferem</span> : '' }
						</div>
					</label>
					<label htmlFor="inp-confirmarSenha" className="label">
						Confirmar Senha
						<input
							disabled={this.state.logadoComGoogle}
							name="confirmarSenha"
							value={this.state.confirmarSenha}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="password"
							id="inp-confirmarSenha" />
						<div className="error-messages">
							{this.state.validations.confirmarSenha.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.confirmarSenha.naoConfere ? <span className="error-message">Senhas não conferem</span> : '' }
						</div>
					</label>
				</div>
				<div className="section section-4">
					<h2 className="subtitle">Endereço</h2>
					<label htmlFor="inp-logradouro" className="label">
						Logradouro
						<input
							name="logradouro"
							value={this.state.logradouro}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange} 
							type="text" 
							id="inp-logradouro" />
						<div className="error-messages">
							{this.state.validations.logradouro.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.logradouro.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<label htmlFor="inp-numero" className="label">
						Número
						<input
							name="numero"
							value={this.state.numero}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange} 
							type="text" 
							id="inp-numero" />
						<div className="error-messages">
							{this.state.validations.numero.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.numero.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<label htmlFor="inp-bairro" className="label">
						Bairro
						<input
							name="bairro"
							value={this.state.bairro}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange} 
							type="text" 
							id="inp-bairro" />
						<div className="error-messages">
							{this.state.validations.bairro.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.bairro.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<label htmlFor="inp-cidade" className="label">
						Cidade
						<input
							name="cidade"
							value={this.state.cidade}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange} 
							type="text" 
							id="inp-cidade" />
						<div className="error-messages">
							{this.state.validations.cidade.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.cidade.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<div className="selecao">
						<p className="section-name">Estado</p>
						<select
							name="estado"
							value={this.state.estado}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange} 
							className='select' 
							id="sel-estado">
							<option value="selecione">Selecione</option>
							<option value="AC">AC</option>
							<option value="AL">AL</option>
							<option value="AP">AP</option>
							<option value="AM">AM</option>
							<option value="BA">BA</option>
							<option value="CE">CE</option>
							<option value="ES">ES</option>
							<option value="GO">GO</option>
							<option value="MA">MA</option>
							<option value="MT">MT</option>
							<option value="MS">MS</option>
							<option value="MG">MG</option>
							<option value="PA">PA</option>
							<option value="PB">PB</option>
							<option value="PR">PR</option>
							<option value="PE">PE</option>
							<option value="PI">PI</option>
							<option value="RJ">RJ</option>
							<option value="RN">RN</option>
							<option value="RS">RS</option>
							<option value="RO">RO</option>
							<option value="RR">RR</option>
							<option value="SC">SC</option>
							<option value="SP">SP</option>
							<option value="SE">SE</option>
							<option value="TO">TO</option>
							<option value="DF">DF</option>
						</select>
						<div className="error-messages">
							{this.state.validations.estado.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
						</div>
					</div>
					<label htmlFor="inp-pais" className="label">
						País
						<input
							disabled={true}
							name="pais"
							value={this.state.pais}
							type="text" 
							id="inp-pais" />
					</label>
					<label htmlFor="inp-cep" className="label">
						Cep
						<input
							name="cep"
							value={this.state.cep}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange} 
							type="text" 
							id="inp-cep" />
						<div className="error-messages">
							{this.state.validations.cep.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.cep.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
				</div>
				<div className="section section-5">
					<h2 className="subtitle">Redes Sociais</h2>
					{this.state.redesSociais.length > 0 ? <div className="listagem">
						<p className="section-name">Suas redes sociais:</p>
						<ul className="listagem">
							{listagem}
						</ul>
					</div> : '' }
					<div className="selecao">
						<p className="section-name">Adicione as suas redes sociais</p>
						<select
							name="nome"
							value={this.state.nome} 
							onChange={this.handleOnChange} 
							className='select' 
							id="sel-redeSocial">
							<option value="selecione">Selecione</option>
							<option value="Linkedin">LinkedIn</option>
							<option value="Twitter">Twitter</option>
							<option value="Facebook">Facebook</option>
							<option value="Instagram">Instagram</option>
							<option value="Youtube">Youtube</option>
						</select>
					</div>
					<label htmlFor="inp-perfil" className="label">
						Perfil
						<input
							name="perfil"
							value={this.state.perfil}
							onBlur={this.handleOnBlur}
							onChange={this.handleOnChange}
							type="text" 
							id="inp-perfil" />
						<div className="error-messages">
							{this.state.validations.perfil.obrigatorio ? <span className="error-message">Campo obrigatório</span> : '' }
							{this.state.validations.perfil.invalido ? <span className="error-message">Campo inválido</span> : '' }
						</div>
					</label>
					<div className="buttons">
						<button
							disabled={!this.state.perfil && !this.state.nome}
							onClick={this.handleAddRedeSocial} 
							type="button" 
							className="button">
							Adicionar Rede Social
						</button>
					</div>
				</div>
				<hr />
				{
					this.state.registered ? (
						<Navigate to='/dashboard' replace={true} />
					) : (
						<Mensagem mensagem={this.state.mensagemDeErro} />
					)
				}
				<div className="buttons">
					<button
						disabled={
							!this.state.nomeEmpresa || 
							!this.state.cnpj || 
							!this.state.ramo || 
							!this.state.numFuncionarios || 
							!this.state.celular || 
							!this.state.telefone || 
							!this.state.email || 
							!this.state.senha || 
							!this.state.confirmarSenha || 
							!this.state.numero || 
							!this.state.bairro || 
							!this.state.cidade || 
							!this.state.cep || 
							this.state.estado === 'Selecione' ||
							!this.state.website ||
							!this.state.logradouro
						} 
						type="submit" 
						className="button">
						Me cadastre
					</button>
				</div>
			</form>
		)
	}
}

export default CadastroEmpresa