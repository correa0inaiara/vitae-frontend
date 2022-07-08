import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getAnsweredQuestions, getQuestionnaireById } from '../data/ApiService'
import QuestoesFormulario from './QuestoesFormulario'

const QuestionarioCandidatura = () => {

	const [questionarioRespondido, setQuestionarioRespondido] = useState(false)
	const [questoesRespondidas, setQuestoesRespondidas] = useState([])
	const [questionario, setQuestionario] = useState()
	const [questoes, setQuestoes] = useState()
	const [vagaId, setVagaId] = useState()
	const [vaga, setVaga] = useState()
	const [usuario, setUsuario] = useState('')

	const params = useParams()
	const navigate = useNavigate()

	useEffect(() => {
		async function getUser() {
			const _user = localStorage.getItem("user")
			let user

			if (_user) {
				user = JSON.parse(_user)
				setUsuario(user)

				const _vagaCandidatura = localStorage.getItem('vagaCandidatura')
				let vagaCandidatura = null
				if (_vagaCandidatura) {
					vagaCandidatura = JSON.parse(_vagaCandidatura)
					setVaga(vagaCandidatura)
					setVagaId(vagaCandidatura.vagaid)
				} else {
					console.log('Erro ao recuperar os dados da vaga, por favor tente novamente.')
					navigate('/vagas/todas')
				}

				const _questionarioCandidatura = localStorage.getItem('questionarioCandidatura')
				let questionarioCandidatura = null
				if (_questionarioCandidatura) {
					questionarioCandidatura = JSON.parse(_questionarioCandidatura)
					setQuestionario(questionarioCandidatura)
				} else {
					questionarioCandidatura = await getQuestionnaireById(params.questinarioId, user.token)
				}

				if (questionarioCandidatura) {
					const questoes = questionarioCandidatura.questoes ? questionarioCandidatura.questoes : null
					setQuestoes(questoes)
				}
			}
		}
		getUser()
	}, [])

	const updateQuestoesRespondidas = async function () {
		if (questoes && questionario && usuario) {
			const questoesRespondidas = await getAnsweredQuestions(questionario.questionarioid, usuario.usuarioId, usuario.token)
			if (questoes.length === questoesRespondidas.length) {
				setQuestionarioRespondido(true)
				setQuestoesRespondidas(questoesRespondidas)
			} else {
				setQuestionarioRespondido(false)
				setQuestoesRespondidas([])
			}
		}
	}

	useEffect(() => {
		async function getQuestoesRespondidas() {
			updateQuestoesRespondidas()	
		}
		getQuestoesRespondidas()
	}, [questoes, questionario, usuario])

	const handleQuestoesRespondidas = async function () {
		updateQuestoesRespondidas()
	}
	
	return (
		<div className="detalhe">
			<Link
				className='detalhe-item__link detalhe-item__link--center'
				to={`/vagas/${vagaId ? vagaId : 'todas'}`}>
				<button
					className="button button--grey"
					>Voltar para Candidatura da Vaga</button>
			</Link>
			{
				questionario ? (
					<div className="detalhes-vaga">
						<h3 className="detalhes-vaga__title">Questionário</h3>
						<div className="detalhe-item">
							<p className="detalhe-item__label">Nome:</p>
							<p className="detalhe-item__value">{questionario.nome}</p>
						</div>
						<div className="detalhe-item">
							<p className="detalhe-item__label">Descrição:</p>
							<p className="detalhe-item__value">{questionario.descricao}</p>
						</div>
						<div className="detalhe-item">
							<p className="detalhe-item__label">Prazo:</p>
							<p className="detalhe-item__value">{questionario.prazo}</p>
						</div>
						<div className="detalhe-item">
							{
								questionarioRespondido ? (
									<>
										{
											questoesRespondidas && questoesRespondidas.length > 0 ? (
												questoesRespondidas.map((item, index) => 
													<li key={index} className="listagem-item">
														<div className="listagem-item__subitem">
															<span className="listagem-item__subitem-label">Questão:</span>
															<span className="listagem-item__subitem-value">{item.questao}</span>
														</div>
														<div className="listagem-item__subitem">
															<span className="listagem-item__subitem-label">Resposta:</span>
															<span className="listagem-item__subitem-value">{item.resposta}</span>
														</div>
													</li>
												)
											) : ''
										}
									</>
								) : (
									questoes && questoes.length > 0 ? (
										questoes.map((item, index) =>
											<QuestoesFormulario key={index} data={item} usuario={usuario} callback={handleQuestoesRespondidas} />
										)
									) : ''
								)
							}
						</div>
					</div>
				) : ''
			}
		</div>
	)
}
export default QuestionarioCandidatura