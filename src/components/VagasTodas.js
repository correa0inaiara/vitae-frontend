import React, { useEffect, useState } from 'react'
import { getAllVacancies, getApplications, getCurriculums } from '../data/ApiService';
import Loader from './Loader';
import VagaDetalhe from './VagaDetalhe';

const VagasTodas = () => {
	
	const [vagas, setVagas] = useState([]);
	const [curriculos, setCurriculos] = useState([]);
	const [usuario, setUsuario] = useState('');
	const [candidaturas, setCandidaturas] = useState([]);
	const [savedUser, setSavedUser] = useState('');
	const [message, setMessage] = useState();
	const [temVagas, setTemVagas] = useState(false);
	const [loading, setLoading] = useState(false);

	const checkCandidaturas = function (resultVagas, resultCandidaturas) {
		for (var i=0; i<resultVagas.length; i++) {
			const vaga = resultVagas[i].vaga
			for (var j=0; j<resultCandidaturas.length; j++) {
				if (vaga.vagaid === resultCandidaturas[j].vagaid) {
					vaga.candidatura = resultCandidaturas[j]
				}
			}
		}
		return resultVagas
	}

	const updateList = async function () {
		setTemVagas(false)
		setVagas([])
		localStorage.removeItem('candidaturas')
		await getList(savedUser)
	}

	const getList = async function (user) {
		setSavedUser(user)
		setLoading(true)

		let resultVagas = await getAllVacancies(user.token)

		setUsuario({
			usuarioId: user.usuarioId,
			tipoUsuario: user.tipoUsuario,
			token: user.token
		})

		if (resultVagas && Object.keys(resultVagas).length > 0) {

			const _curriculos = localStorage.getItem("curriculos")
			let resultCurriculos = []
			if (_curriculos) {
				resultCurriculos = JSON.parse(_curriculos)
			} else {
				resultCurriculos = await getCurriculums(user.usuarioId, user.token)
				localStorage.setItem('curriculos', JSON.stringify(resultCurriculos))
			}
			setCurriculos(resultCurriculos)

			if (user.tipoUsuario === 'Candidato') {
				const _candidaturas = localStorage.getItem("candidaturas")
				let resultCandidaturas = []
				if (_candidaturas) {
					resultCandidaturas = JSON.parse(_candidaturas)
				} else {
					resultCandidaturas = await getApplications(user.usuarioId, user.token)
					localStorage.setItem('candidaturas', JSON.stringify(resultCandidaturas))
				}
				setCandidaturas(resultCandidaturas)

				if (resultCandidaturas && Object.keys(resultCandidaturas).length > 0) {
					const resultado = checkCandidaturas(resultVagas, resultCandidaturas)
					setVagas(resultado);
				} else {
					setVagas(resultVagas);
				}
			} else {
				setVagas(resultVagas);
			}
			
			setTemVagas(true);
			setLoading(false)
		} else {
			setVagas([])
			setTemVagas(false);
			const mensagem = 'Você ainda não tem vagas cadastrados'
			setMessage(mensagem)
			loading(false)
		}

		const tipoUsuario = user.tipoUsuario;
		return resultVagas
	}

	useEffect(() => {
		async function getUser() {
			const _user = localStorage.getItem("user")
			let user

			if (_user) {
				user = JSON.parse(_user)

				const resultVagas = await getList(user)

				return resultVagas
			} else {
				console.log('Erro ao recuperar os dados do usuário.')
				return false
			}
		}
		getUser()
	}, [])

	return (
		<div className="vagas-todas">
			<h1 className="title">Todas as Vagas</h1>
			{
				loading ? (
					<Loader />
				) : (
					temVagas ? 
					<div className="lista">
						{
							vagas && vagas.length > 0 ? (
								vagas.map((vaga, index) =>
									<VagaDetalhe 
										key={index} 
										callback={updateList}
										data={vaga} 
										usuario={usuario} 
										todas={true} 
										candidaturas={candidaturas}
										curriculos={curriculos}
									/> 
								)
							) : ''
						}
					</div> : 
					<p className="message">{message}</p> 
				
				)
			}
		</div>
	)
}

export default VagasTodas