import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { getQuestionnaire, getTypesOfHiringAndBenefits, getVacancy } from '../data/ApiService';
import VagaFormulario from './VagaFormulario';
import VagaDetalhe from './VagaDetalhe';
import Loader from './Loader';

const Vagas = () => {
	const [vagas, setVagas] = useState([]);
	const [title, setTitle] = useState('Vagas');
	const [usuario, setUsuario] = useState('');
	const [savedUser, setSavedUser] = useState('');
	const [message, setMessage] = useState();
	const [temVagas, setTemVagas] = useState(false);
	const [loading, setLoading] = useState(false);


	const updateList = async function () {
		setTemVagas(false)
		setVagas([])
		localStorage.removeItem('vagas')
		await getList(savedUser)
	}

	const getList = async function (user) {
		setSavedUser(user)
		setLoading(true)

		setUsuario({
			usuarioId: user.usuarioId,
			token: user.token
		})

		const _vagas = localStorage.getItem("vagas")
		let resultVagas = []
		if (_vagas) {
			resultVagas = JSON.parse(_vagas)
		} else {
			resultVagas = await getVacancy(user.usuarioId, user.token)
			localStorage.setItem('vagas', JSON.stringify(resultVagas))
		}
		
		if (resultVagas && Object.keys(resultVagas).length > 0) {
			setVagas(resultVagas);
			setTemVagas(true);
			setLoading(false)
		} else {
			setVagas([])
			setLoading(false)
			setTemVagas(false);
			const mensagem = 'Você ainda não tem vagas cadastrados'
			setMessage(mensagem)
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

				const result = await getList(user)

				return result
			} else {
				console.log('Erro ao recuperar os dados do usuário.')
				return false
			}
		}
		getUser()
	}, [])

	return (
		<div className="vagas">
			<h1 className="title">{title}</h1>
			<VagaFormulario edit={false} callback={(e) => updateList(e)} />
			{
				loading ? (
					<Loader />
				) : (
					temVagas ? 
					<div className="lista">
						{vagas && vagas.length > 0 && vagas.map((vaga, index) =>
							<VagaDetalhe callback={updateList} key={index} data={vaga} usuario={usuario} /> 
						)}
					</div> : 
					<p className="message">{message}</p> 
				
				)
			}
		</div>
	)
}

export default Vagas