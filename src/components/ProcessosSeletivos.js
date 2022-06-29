import React, { useEffect, useState } from 'react'
import { getSelectionProcesses } from '../data/ApiService';
import Loader from './Loader';
import ProcessoSeletivoDetalhe from './ProcessoSeletivoDetalhe'
import ProcessoSeletivoFormulario from './ProcessoSeletivoFormulario'

const ProcessosSeletivos = () => {
	const [processosSeletivos, setProcessosSeletivos] = useState([]);
	const [usuario, setUsuario] = useState('');
	const [message, setMessage] = useState();
	const [temProcessosSeletivos, setTemProcessosSeletivos] = useState(false);
	const [loading, setLoading] = useState(false);

	const updateList = async function () {
		setTemProcessosSeletivos(false)
		setProcessosSeletivos([])
		localStorage.removeItem('processosSeletivos')
		await getList(usuario)
	}

	const getList = async function (user) {
		setUsuario(user)
		setLoading(true)

		const _processosSeletivos = localStorage.getItem("processosSeletivos")
		let resultProcessosSeletivos = []
		if (_processosSeletivos) {
			resultProcessosSeletivos = JSON.parse(_processosSeletivos)
		} else {
			resultProcessosSeletivos = await getSelectionProcesses(user.usuarioId, user.token)
			localStorage.setItem('processosSeletivos', JSON.stringify(resultProcessosSeletivos))
		}

		setUsuario({
			usuarioId: user.usuarioId,
			tipoUsuario: user.tipoUsuario,
			token: user.token
		})

		if (resultProcessosSeletivos && Object.keys(resultProcessosSeletivos).length > 0) {
			setProcessosSeletivos(resultProcessosSeletivos);
			setTemProcessosSeletivos(true);
			setLoading(false)
		} else {
			setProcessosSeletivos([])
			setTemProcessosSeletivos(false);
			const mensagem = 'Você ainda não tem processos seletivos cadastrados'
			setMessage(mensagem)
			setLoading(false)
		}

		const tipoUsuario = user.tipoUsuario;
		return resultProcessosSeletivos
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
		<div className="processos-seletivos">
			<h1 className="title">Processos Seletivos</h1>
			<ProcessoSeletivoFormulario edit={false} callback={(e) => updateList(e)} />
			<div className="lista">
				{
					loading ? (
						<Loader />
					) : (
						temProcessosSeletivos ? (
							processosSeletivos && processosSeletivos.map((processoSeletivo, index) =>
								<ProcessoSeletivoDetalhe callback={updateList} key={index} data={processoSeletivo} usuario={usuario} />
							)
						) : <p className="message">{message}</p>
					)
				}
			</div>
		</div>
	)
}

export default ProcessosSeletivos