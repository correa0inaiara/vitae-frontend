export const apiURL = process.env.REACT_APP_API_URL;

/* LOGIN */

export async function login(credenciais) {
	try {
		const response = await fetch(`${apiURL}/login`, {
			method: 'POST',
			headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
			body: JSON.stringify(credenciais)
		})
		return response
	} catch (error) {
		console.log('Login falhou: ' + error)	
	}
}

export async function getItem() {
	const token = localStorage.getItem('token');
	if (token) {
		const newToken = JSON.parse(token)
		return newToken
	} else {
		return []
	}
}

/* AGENDAMENTOS */

export async function getSchedule(usuarioId, token) {
	const result = await getScheduleByUser(usuarioId, token)
	return result
}

export async function getScheduleBySelectionProcess(processoSeletivoId, token) {
	try {
		const response = await fetch(`${apiURL}/agendamentos/${processoSeletivoId}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			}
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

export async function getScheduleByUser(usuarioId, token) {
	try {
		const response = await fetch(`${apiURL}/agendamentos/usuario/${usuarioId}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			}
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

export async function createSchedule(processoSeletivoId, candidatoSelecionadoId, token, data) {
	try {
		const response = await fetch(`
			${apiURL}/agendamentos/${processoSeletivoId}?candidatoSelecionadoId=${candidatoSelecionadoId}`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			},
			body: JSON.stringify(data)
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

export async function editSchedule(agendamentoId, token, data) {
	try {
		const response = await fetch(`
			${apiURL}/agendamentos/${agendamentoId}`, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			},
			body: JSON.stringify(data)
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

export async function deleteSchedule(agendamentoId, token) {
	try {
		const response = await fetch(`
			${apiURL}/agendamentos/${agendamentoId}`, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			}
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

/* PROCESSOS SELETIVOS */

export async function editSelectionProcess(usuarioId, processoSeletivoId, token, data) {
	const empresa = await getCompany(usuarioId, token)
	const empresaId = empresa[0].empresaid
	data.empresaId = empresaId
	const processosSeletivos = await editUserSelectionProcess(processoSeletivoId, token, data)
	return processosSeletivos
}

export async function deleteUserSelectionProcess(processoSeletivoId, token) {
	try {
		const response = await fetch(`
		${apiURL}/processosseletivos/${processoSeletivoId}`, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			}
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

export async function editUserSelectionProcess(processoSeletivoId, token, data) {
	try {
		const response = await fetch(`
		${apiURL}/processosseletivos/${processoSeletivoId}`, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			},
			body: JSON.stringify(data)
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

export async function registerSelectionProcess(usuarioId, vagaId, token, data) {
	const empresa = await getCompany(usuarioId, token)
	const empresaId = empresa[0].empresaid
	const processosSeletivos = await createUserSelectionProcess(empresaId, vagaId, token, data)
	return processosSeletivos
}

export async function createUserSelectionProcess(empresaId, vagaId, token, data) {
	try {
		const response = await fetch(`
		${apiURL}/processosseletivos/${empresaId}?vagaId=${vagaId}`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			},
			body: JSON.stringify(data)
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

export async function getSelectionProcesses(usuarioId, token) {
	const empresa = await getCompany(usuarioId, token)
	const empresaId = empresa[0].empresaid
	const processosSeletivos = await getUserSelectionProcesses(empresaId, token)
	return processosSeletivos
}

export async function getUserSelectionProcesses(empresaId, token) {
	try {
		const response = await fetch(`${apiURL}/processosseletivos/${empresaId}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			}
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

export async function getSelectedCandidates(processoSeletivoId, token) {
	try {
		const response = await fetch(`${apiURL}/candidatosselecionados/${processoSeletivoId}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			}
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

/* CANDIDATURAS */

export async function getApplications(usuarioId, token) {
	const candidato = await getCandidate(usuarioId, token)
	const candidatoId = candidato[0].candidatoid
	const result = await getUserApplications(candidatoId, token)
	return result
}

export async function getAllApplicationsByVacancy(vagaId, token) {
	try {
		const response = await fetch(`${apiURL}/candidaturas/vaga/${vagaId}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			}
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

export async function getCandidate(usuarioId, token) {
	try {
		const response = await fetch(`${apiURL}/candidatos/${usuarioId}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			}
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

export async function getApplicationById(candidaturaId, token) {
	try {
		const response = await fetch(`${apiURL}/candidaturas/${candidaturaId}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			}
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

export async function getUserApplications(candidaturaId, token) {
	try {
		const response = await fetch(`${apiURL}/candidaturas/candidato/${candidaturaId}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			}
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

export async function createApplication(usuarioId, vagaId, curriculoId, token) {
	const candidato = await getCandidate(usuarioId, token)
	const candidatoId = candidato[0].candidatoid
	const result = await createUserApplication(candidatoId, vagaId, curriculoId, token)
	return result
}

export async function createUserApplication(candidatoId, vagaId, curriculoId, token) {
	try {
		const response = await fetch(`
			${apiURL}/candidaturas?
			candidatoId=${candidatoId}&curriculoId=${curriculoId}&vagaId=${vagaId}
			`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			}
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

export async function registerSelectedCandidate(candidaturaId, processoSeletivoId, token) {
	try {
		const response = await fetch(`
			${apiURL}/candidatosselecionados/${processoSeletivoId}?candidaturaId=${candidaturaId}
			`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			}
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}


/* VAGAS */

export async function registerVacancy(questionarioId, tipoContratacaoId, usuarioId, token, data, beneficiosOferecidos) {
	const empresa = await getCompany(usuarioId, token)
	const empresaId = empresa[0].empresaid
	
	const vaga = await createUserVacancy(questionarioId, empresaId, tipoContratacaoId, token, data)
	const vagaId = vaga[0].vagaid
	

	await Promise.all(beneficiosOferecidos.map(async item => {
		const beneficio = await createUserOfferedBenefits(vagaId, item.beneficioId, token)
	}))
	
	return vaga
}

export async function createUserVacancy(questionarioId, empresaId, tipoContratacaoId, token, data) {
	try {

		let fetchStr = `${apiURL}/vagas/${empresaId}?tipoContratacaoId=${tipoContratacaoId}`
		
		fetchStr = questionarioId ? fetchStr + `&questionarioId=${questionarioId}` : fetchStr
        
		const response = await fetch(
			fetchStr
			, {
			method: 'POST',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			},
			body: JSON.stringify(data)
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

export async function getTypesOfHiringAndBenefits(token) {
	try {
		const response = await fetch(`${apiURL}/tiposcontratacaoebeneficios`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			}
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

export async function getVacancy(usuarioId, token) {
	const empresa = await getCompany(usuarioId, token)
	if (empresa && empresa.length > 0) {
		const empresaId = empresa[0].empresaid
		const vagas = await getUserVacancies(empresaId, token)
		return vagas
	} else {
		return []
	}
}

export async function createUserOfferedBenefits(vagaId, beneficioId, token) {
	try {
		const response = await fetch(
			`${apiURL}/beneficiosoferecidos/${vagaId}?beneficioId=${beneficioId}`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			}
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

export async function getUserVacancies(empresaId, token) {
	try {
		const response = await fetch(
			`${apiURL}/vagas/${empresaId}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			}
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

export async function getUserOfferedBenefits(vagaId, token) {
	try {
		const response = await fetch(
			`${apiURL}/beneficiosoferecidos/${vagaId}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			}
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

export async function editVacancy(vagaId, token, data, beneficiosOferecidos) {
	const vagaResult = await editUserVacancy(vagaId, token, data)
	const beneficiosOferecidosResult = await editUserOfferedBenefits(vagaId, token, beneficiosOferecidos)
	const result = {
		vagaResult,
		beneficiosOferecidosResult
	}
	return result
}

export async function editUserOfferedBenefits(vagaId, token, data) {
	try {
		const response = await fetch(`${apiURL}/beneficiosOferecidos/${vagaId}`, {
			method: 'PUT',
			headers: {
				'Token': `${token}`,
				'Accept': 'application/json', 'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		const json = await response.json();
		return json
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}

export async function editUserVacancy(vagaId, token, data) {
	try {
		const response = await fetch(`${apiURL}/vagas/${vagaId}`, {
			method: 'PUT',
			headers: {
				'Token': `${token}`,
				'Accept': 'application/json', 'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		const json = await response.json();
		return json
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}

export async function deleteVacancy(vagaId, token) {
	const vagaResult = await deleteUserVacancy(vagaId, token)
	return vagaResult
}

export async function deleteUserVacancy(vagaId, token, data) {
	try {
		const response = await fetch(`${apiURL}/vagas/${vagaId}`, {
			method: 'DELETE',
			headers: {
				'Token': `${token}`,
				'Accept': 'application/json', 'Content-Type': 'application/json'
			}
		})
		const json = await response.json();
		return json
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}

export async function getAllVacancies(token) {
	try {
		const response = await fetch(
			`${apiURL}/vagas`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			}
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

/* QUESTIONARIOS */

export async function getQuestionnaire(usuarioId, token) {
	const empresa = await getCompany(usuarioId, token)
	if (empresa && empresa.length > 0) {
		const empresaId = empresa[0].empresaid
		const questionario = await getUserQuestionnaires(empresaId, token)
		return questionario
	} else {
		return []
	}
}

export async function getCompany(usuarioId, token) {
	try {
		const response = await fetch(`${apiURL}/empresas/${usuarioId}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			}
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

export async function getUserQuestionnaires(usuarioId, token) {
	try {
		const response = await fetch(`${apiURL}/questionarios/${usuarioId}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Token': `${token}`
			}
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

export async function registerQuestionnarie(data, questoes, usuarioId, token) {
	const empresa = await getCompany(usuarioId, token)
	const empresaId = empresa[0].empresaid
	const questionario = await createQuestionnaire(data, empresaId, token)
	const questionarioId = questionario[0].questionarioid
	const questoesResult = await createQuestion(questoes, questionarioId, token)
	const result = {
		questionario,
		questoes: questoesResult
	}
	return result
}

export async function createQuestionnaire(data, empresaId, token) {
	try {
		const response = await fetch(`${apiURL}/questionarios/${empresaId}`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json',
				'Token': `${token}`
			},
			body: JSON.stringify(data)
		})
		const json = await response.json();
		return json;
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}

export async function createQuestion(data, questionarioId, token) {
	try {
		const response = await fetch(`${apiURL}/questoes/${questionarioId}`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json',
				'Token': `${token}`
			},
			body: JSON.stringify(data)
		})
		const json = await response.json();
		return json
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}

export async function editUserQuestions(questionsId, token, data) {
	try {
		const response = await fetch(`${apiURL}/questoes/${questionsId}`, {
			method: 'PUT',
			headers: {
				'Token': `${token}`,
				'Accept': 'application/json', 'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		const json = await response.json();
		return json
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}

export async function editQuestionnaire(questionarioId, token, data, questoes) {
	const questionarios = await editUserQuestionnaire(questionarioId, token, data)
	return questionarios
}

export async function editUserQuestionnaire(questionarioId, token, data) {
	try {
		const response = await fetch(`${apiURL}/questionarios/${questionarioId}`, {
			method: 'PUT',
			headers: {
				'Token': `${token}`,
				'Accept': 'application/json', 'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		const json = await response.json();
		return json
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}

export async function deleteUserQuestionnaire(questionarioId, token) {
	try {
		const response = await fetch(`${apiURL}/questionarios/${questionarioId}`, {
			method: 'DELETE',
			headers: {
				'token': `${token}`,
				'Accept': 'application/json', 'Content-Type': 'application/json'
			}
		})
		const json = await response.json();
		return json;
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}

/* RELATORIOS */
export async function getRelatorios(token) {
	try {
		const response = await fetch(`${apiURL}/relatorios`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json', 
				'Content-Type': 'application/json', 
				'Token': `${token}`
			}
		})
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('Erro ao recuperar a listagem de usuários: ', error)
		return error
	}
}

/* USUARIOS */

export async function createUser(usuario) {
	try {
		const response = await fetch(`${apiURL}/usuarios`, {
			method: 'POST',
			headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
			body: JSON.stringify(usuario)
		})
		const json = await response.json();
		return json[0].usuarioid;
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}

export async function createCompany(usuarioId, empresa) {
	try {
		const response = await fetch(`${apiURL}/empresas/${usuarioId}`, {
			method: 'POST',
			headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
			body: JSON.stringify(empresa)
		})
		const json = await response.json();
		return json[0].empresaid;
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}

export async function createCandidate(usuarioId, candidato) {
	try {
		const response = await fetch(`${apiURL}/candidatos/${usuarioId}`, {
			method: 'POST',
			headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
			body: JSON.stringify(candidato)
		})
		const json = await response.json();
		return json[0].candidatoid;
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}

export async function createContact(usuarioId, contatos) {
	try {
		const response = await fetch(`${apiURL}/contatos/${usuarioId}`, {
			method: 'POST',
			headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
			body: JSON.stringify(contatos)
		})
		const json = await response.json();
		return json
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}

export async function createAddress(usuarioId, endereco) {
	try {
		const response = await fetch(`${apiURL}/enderecos/${usuarioId}`, {
			method: 'POST',
			headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
			body: JSON.stringify(endereco)
		})
		const json = await response.json();
		return json[0].enderecoid;
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}

export async function createSocialNetwork(usuarioId, redesSociais) {
	try {
		const response = await fetch(`${apiURL}/redessociais/${usuarioId}`, {
			method: 'POST',
			headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
			body: JSON.stringify(redesSociais)
		})
		const json = await response.json();
		return json;
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}

export async function registerUser(data, tipoUsuario) {
	try {
		const usuario = {
			email: data.email,
			senha: data.senha,
			tipoUsuario: tipoUsuario,
			loginSocial: data.logadoComGoogle
		}

		let usuarioDados
		if (tipoUsuario === 'Candidato') {
			usuarioDados = {
				nomeCompleto: data.nomeCandidato,
				cpf: data.cpf,
				profissao: data.profissao,
				dataNascimento: data.dataNascimento,
				carteiraHabilitacao: data.carteiraHabilitacao,
				website: data.website
			}
		} else {
			usuarioDados = {
				nomeDaEmpresa: data.nomeEmpresa,
				cnpj: data.cnpj,
				ramoDaEmpresa: data.ramo,
				numeroDeFuncionarios: data.numFuncionarios,
				website: data.website
			}
		}
		const contatos = [
			{
				tipoContato: "Celular",
				contato: data.celular
			},
			{
				tipoContato: "Telefone",
				contato: data.telefone
			}
		]
		const endereco = {
			cep: data.cep,
			logradouro: data.logradouro,
			complemento: "",
			numero: data.numero,
			bairro: data.bairro,
			cidade: data.cidade,
			uf: data.estado,
			pais: data.pais
		}
		const redesSociais = data.redesSociais

		const credenciais = {
			email: data.email,
			senha: data.senha
		}
		
		const usuarioId = await createUser(usuario)
		if (tipoUsuario === 'Candidato') {
			const candidatoId = await createCandidate(usuarioId, usuarioDados)
		} else {
			const empresaId = await createCompany(usuarioId, usuarioDados)
		}
		const contato = await createContact(usuarioId, contatos)
		const enderecoId = await createAddress(usuarioId, endereco)
		const redeSocial = await createSocialNetwork(usuarioId, redesSociais)
		return true;
	} catch (error) {
        console.log('Erro no registro do usuário: ', error);
		return false;
	}
}

/* CURRICULOS */

export async function getCurriculums(usuarioId, token) {
	try {
		const response = await fetch(`${apiURL}/curriculos/${usuarioId}`, {
			method: 'GET',
			headers: {
				'token': `${token}`,
				'Accept': 'application/json', 'Content-Type': 'application/json'
			}
		})
		const json = await response.json();
		return json
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}

export async function editarCurriculum(curriculoId, token, data) {
	try {
		const response = await fetch(`${apiURL}/curriculos/${curriculoId}`, {
			method: 'PUT',
			headers: {
				'Token': `${token}`,
				'Accept': 'application/json', 'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		const json = await response.json();
		return json
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}

export async function createCurriculum(usuarioId, token, data) {
	try {
		const response = await fetch(`${apiURL}/curriculos/${usuarioId}`, {
			method: 'POST',
			headers: {
				'Token': `${token}`,
				'Accept': 'application/json', 'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		const json = await response.json();
		return json
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}

export async function createEducation(usuarioId, token, data) {
	try {
		const response = await fetch(`${apiURL}/educacao/${usuarioId}`, {
			method: 'POST',
			headers: {
				'token': `${token}`,
				'Accept': 'application/json', 'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		const json = await response.json();
		return json;
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}

export async function createCourses(usuarioId, token, data) {
	try {
		const response = await fetch(`${apiURL}/cursos/${usuarioId}`, {
			method: 'POST',
			headers: {
				'token': `${token}`,
				'Accept': 'application/json', 'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		const json = await response.json();
		return json;
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}

export async function createLanguages(usuarioId, token, data) {
	try {
		const response = await fetch(`${apiURL}/idiomas/${usuarioId}`, {
			method: 'POST',
			headers: {
				'token': `${token}`,
				'Accept': 'application/json', 'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		const json = await response.json();
		return json;
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}

export async function createExperience(usuarioId, token, data) {
	try {
		const response = await fetch(`${apiURL}/experiencias/${usuarioId}`, {
			method: 'POST',
			headers: {
				'token': `${token}`,
				'Accept': 'application/json', 'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		const json = await response.json();
		return json;
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}

export async function createSkills(usuarioId, token, data) {
	try {
		const response = await fetch(`${apiURL}/habilidades/${usuarioId}`, {
			method: 'POST',
			headers: {
				'token': `${token}`,
				'Accept': 'application/json', 'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		const json = await response.json();
		return json;
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}

export async function registerCurriculum(usuarioId, token, data) {
	const curriculo = createCurriculum(usuarioId, token, data)
	return curriculo
}

export async function deleteUserCurriculum(curriculoId, token) {
	try {
		const response = await fetch(`${apiURL}/curriculos/${curriculoId}`, {
			method: 'DELETE',
			headers: {
				'token': `${token}`,
				'Accept': 'application/json', 'Content-Type': 'application/json'
			}
		})
		const json = await response.json();
		return json;
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}

export async function editUserCurriculum(curriculoId, token, data) {
	try {
		const response = await fetch(`${apiURL}/curriculos/${curriculoId}`, {
			method: 'PUT',
			headers: {
				'token': `${token}`,
				'Accept': 'application/json', 'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		const json = await response.json();
		return json;
	} catch (error) {
        console.log("🚀 ~ file: ApiService.js ~ line 26 ~ createUser ~ error", error)
		return error
	}
}