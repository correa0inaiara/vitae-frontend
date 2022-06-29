import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { getQuestionnaire } from '../data/ApiService';
import QuestionarioFormulario from './QuestionarioFormulario';
import QuestionarioDetalhe from './QuestionarioDetalhe';
import Loader from './Loader';

const Questionarios = () => {
	const [questionarios, setQuestionarios] = useState([]);
	const [title, setTitle] = useState('Questionários');
	const [usuario, setUsuario] = useState('');
	const [savedUser, setSavedUser] = useState('');
	const [message, setMessage] = useState();
	const [temQuestionarios, setTemQuestionarios] = useState(false);
	const [loading, setLoading] = useState(false);

	const updateList = async function () {
		console.log('update list')
		await getList(savedUser)
	}

	const getList = async function (user) {
		setSavedUser(user)
		setLoading(true)
		const result = await getQuestionnaire(user.usuarioId, user.token)

		setUsuario({
			usuarioId: user.usuarioId,
			token: user.token
		})

		if (result && result.length > 0) {
			setQuestionarios(result);
			setTemQuestionarios(true);
			setLoading(false)
		} else {
			setQuestionarios([])
			setLoading(false)
			setTemQuestionarios(false);
			const mensagem = 'Você ainda não tem questionários cadastrados'
			setMessage(mensagem)
		}

		const tipoUsuario = user.tipoUsuario;
		return result
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
		<div className="questionarios">
			<h1 className="title">{title}</h1>
			<QuestionarioFormulario edit={false} callback={(e) => updateList(e)} />
			{
				loading ? (
					<Loader />
				) : (
					temQuestionarios ? 
						<div className="lista">
							{questionarios && questionarios.length > 0 && questionarios.map((questionario, index) =>
								<QuestionarioDetalhe callback={updateList} key={index} data={questionario} usuario={usuario} /> 
							)}
						</div> : 
						<p className="message">{message}</p> 
				)
			}
		</div>
	)
}

export default Questionarios