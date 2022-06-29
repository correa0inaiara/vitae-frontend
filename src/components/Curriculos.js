import React, { useEffect } from 'react'
import { useState } from 'react'
import { getCurriculums } from '../data/ApiService';
import CurriculoDetalhe from './CurriculoDetalhe';
import CurriculoFormulario from './CurriculoFormulario';
import Loader from './Loader';

const Curriculos = () => {
	const [curriculos, setCurriculos] = useState([]);
	const [title, setTitle] = useState('Currículos');
	const [usuario, setUsuario] = useState('');
	const [savedUser, setSavedUser] = useState('');
	const [message, setMessage] = useState();
	const [temCurriculos, setTemCurriculos] = useState(false);
	const [loading, setLoading] = useState(false);

	const updateList = async function () {
		setTemCurriculos(false)
		setCurriculos([])
		localStorage.removeItem('curriculos')
		await getList(savedUser)
	}

	const getList = async function (user) {
		setSavedUser(user)
		setLoading(true)

		setUsuario({
			usuarioId: user.usuarioId,
			tipoUsuario: user.tipoUsuario,
			token: user.token
		})

		const _curriculos = localStorage.getItem("curriculos")
		let resultCurriculos = []
		if (_curriculos) {
			resultCurriculos = JSON.parse(_curriculos)
		} else {
			resultCurriculos = await getCurriculums(user.usuarioId, user.token)
			localStorage.setItem('vagas', JSON.stringify(resultCurriculos))
		}

		if (resultCurriculos && Object.keys(resultCurriculos).length > 0) {
			setCurriculos(resultCurriculos);
			setTemCurriculos(true);
			setLoading(false)
		} else {
			setCurriculos([])
			setLoading(false)
			setTemCurriculos(false);
			const mensagem = 'Você ainda não tem curriculos cadastrados'
			setMessage(mensagem)
		}

		return resultCurriculos
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
		<div className="curriculos">
			<h1 className="title">{title}</h1>
			<CurriculoFormulario edit={false} callback={(e) => updateList(e)} usuario={usuario} />
			{
				loading ? (
					<Loader />
				) : (
					temCurriculos ? 
					<div className="lista">
						{curriculos && curriculos.length > 0 && curriculos.map((vaga, index) =>
							<CurriculoDetalhe key={index} callback={updateList} data={vaga} usuario={usuario} /> 
						)}
					</div> : 
					<p className="message">{message}</p> 
				
				)
			}
		</div>
	)
}

export default Curriculos