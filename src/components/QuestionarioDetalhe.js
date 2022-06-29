import React, { useRef, useState } from 'react'
import { deleteUserQuestionnaire } from '../data/ApiService'
import Editable from './Editable'
import QuestionarioFormulario from './QuestionarioFormulario'

const QuestionarioDetalhe = ({ callback, data, index, usuario }) => {

	const questionario = data.questionario
	const questoes = data.questoes

	const [editado, setEditado] = useState(false)
	const [questionarioNome, setQuestionarioNome] = useState(questionario.nome)
	const [questionarioDescricao, setQuestionarioDescricao] = useState(questionario.descricao)
	const [questionarioPrazo, setQuestionarioPrazo] = useState(questionario.prazo)
	const [questionarioQuestoes, setQuestionarioQuestoes] = useState(questoes)
	const [edit, setEdit] = useState(false)
	const [editData, setEditData] = useState(false)

	const handleDelete = async function (event) {
		const result = await deleteUserQuestionnaire(questionario.questionarioid, usuario.token)
		callback()
	}

	const handleEdit = function (event) {
		setEdit(true)
		const data = {
			nome: questionarioNome,
			descricao: questionarioDescricao,
			prazo: questionarioPrazo,
			questoes: questionarioQuestoes,
			questionarioId: questionario.questionarioid
		}
		setEditData(data)
	}

	return (
		<div key={index} className="detalhe">
			<div className="detalhe-item">
				<p className="detalhe-item__label">Nome:</p>
				<p className="detalhe-item__value">{questionarioNome}</p>
			</div>
			<div className="detalhe-item">
				<p className="detalhe-item__label">Descrição:</p>
				<p className="detalhe-item__value">{questionarioDescricao}</p>
			</div>
			<div className="detalhe-item">
				<p className="detalhe-item__label">Prazo:</p>
				<p className="detalhe-item__value">{questionarioPrazo}</p>
			</div>
			<div className="detalhe-item">
				<p className="detalhe-item__subitem-label">Questões: </p>
				{questoes.map((item, index) => (
					<div key={index} className="detalhe-item__questoes-values">
						<p className="detalhe-item__label">Questão {index + 1}</p>
						<p className="detalhe-item__value">{item.questao}</p>
					</div>
				))}
			</div>
			<div className="buttons">
				<button 
					onClick={handleEdit}
					className="button button--green">
						Editar
					</button>
				<button 
					onClick={handleDelete}
					className="button button--green">
						Delete
					</button>
			</div>
			{
				edit ? (
					<QuestionarioFormulario callback={callback} edit={true} data={editData} />
				) : ''
			}
		</div>
	)
}
export default QuestionarioDetalhe