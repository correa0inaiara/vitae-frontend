import React, { useRef } from 'react'
import { useState } from 'react'
import { deleteUserCurriculum } from '../data/ApiService'
import CurriculoFormulario from './CurriculoFormulario'

const CurriculoDetalhe = ({callback, data, usuario}) => {
	const [edit, setEdit] = useState(false)
	const [editado, setEditado] = useState(false)
	const [editData, setEditData] = useState(false)

	const [nome, setNome] = useState(data.nome)
	const [descricao, setDescricao] = useState(data.descricao)
	const [curriculoId, setCurriculoId] = useState(data.curriculoid)
	const [cursos, setCursos] = useState(data.cursos);
	const [educacao, setEducacao] = useState(data.educacao);
	const [experiencias, setExperiencias] = useState(data.experiencias);
	const [habilidades, setHabilidades] = useState(data.habilidades);
	const [idiomas, setIdiomas] = useState(data.idiomas);

	const handleDelete = async function () {
		const result = await deleteUserCurriculum(curriculoId, usuario.token)
		callback()
	}

	const handleEdit = function () {
		setEdit(true)
		const data = {
			nome: nome,
			descricao: descricao,
			cursos: cursos,
			educacaoArr: educacao,
			experiencias: experiencias,
			habilidades: habilidades,
			idiomas: idiomas,
			curriculoId: curriculoId
		}
		setEditData(data)
	}

	return (
		<div className="detalhe">
			<h1 className="title">Currículo</h1>
			<div className="detalhes-curriculo">
				<h3 className="subtitle">Sobre Curriculo</h3>
				<div className="detalhe-item">
					<p className="detalhe-item__label">Nome:</p>
					<p className="detalhe-item__value">{data.nome}</p>
				</div>
				<div className="detalhe-item">
					<p className="detalhe-item__label">Descrição:</p>
					<p className="detalhe-item__value">{data.descricao}</p>
				</div>
			</div>
			<div className="detalhes-vaga">
				<div className="detalhe-item">
					<p className="subtitle subtitle-subtitem">Educação:</p>
					{
						educacao && educacao.length > 0 ? (
							educacao.map(item =>
								<div key={item.educacaoid} className="detalhe-item__subtitens">
									<div className="detalhe-item__subtitem">
										<p className="detalhe-item__label">Educação:</p>
										<p className="detalhe-item__value">{item.educacao}</p>
									</div>
									<div className="detalhe-item__subtitem">
										<p className="detalhe-item__label">Localização:</p>
										<p className="detalhe-item__value">{item.localizacao}</p>
									</div>
									<div className="detalhe-item__subtitem">
										<p className="detalhe-item__label">Período Inicial:</p>
										<p className="detalhe-item__value">{item.periodoinicial}</p>
									</div>
									<div className="detalhe-item__subtitem">
										<p className="detalhe-item__label">Período Final:</p>
										<p className="detalhe-item__value">{item.periodofinal}</p>
									</div>
								</div>
							)
						) : <p className="mensagem">Educação não cadastrada</p>
					}
				</div>
				<div className="detalhe-item">
					<p className="subtitle subtitle-subtite">Cursos:</p>
					{
						cursos && cursos.length > 0 ? (
							cursos.map(item =>
								<div key={item.cursoid} className="detalhe-item__subtitens">
									<div className="detalhe-item__subtitem">
										<p className="detalhe-item__label">Curso:</p>
										<p className="detalhe-item__value">{item.curso}</p>
									</div>
									<div className="detalhe-item__subtitem">
										<p className="detalhe-item__label">Localização:</p>
										<p className="detalhe-item__value">{item.localizacao}</p>
									</div>
									<div className="detalhe-item__subtitem">
										<p className="detalhe-item__label">Duração em Horas:</p>
										<p className="detalhe-item__value">{item.duracaoemhoras}h</p>
									</div>
								</div>
							)
						) : <p className="mensagem">Cursos não cadastrados</p>
					}
				</div>
				<div className="detalhe-item">
					<p className="subtitle subtitle-subtite">Experiências:</p>
					{
						experiencias && experiencias.length > 0 ? (
							experiencias.map(item =>
								<div key={item.experienciaid} className="detalhe-item__subtitens">
									<div className="detalhe-item__subtitem">
										<p className="detalhe-item__label">Experiência:</p>
										<p className="detalhe-item__value">{item.cargo}</p>
									</div>
									<div className="detalhe-item__subtitem">
										<p className="detalhe-item__label">Localizacao:</p>
										<p className="detalhe-item__value">{item.localizacao}</p>
									</div>
									<div className="detalhe-item__subtitem">
										<p className="detalhe-item__label">Empresa:</p>
										<p className="detalhe-item__value">{item.empresa}</p>
									</div>
									<div className="detalhe-item__subtitem">
										<p className="detalhe-item__label">Período Inicial:</p>
										<p className="detalhe-item__value">{item.periodoinicial}</p>
									</div>
									<div className="detalhe-item__subtitem">
										<p className="detalhe-item__label">Período Final:</p>
										<p className="detalhe-item__value">{item.periodofinal}</p>
									</div>
								</div>
							)
						) : <p className="mensagem">Experiências não cadastradas</p>
					}
				</div>
				<div className="detalhe-item">
					<p className="subtitle subtitle-subtite">Habilidades:</p>
					{
						habilidades && habilidades.length > 0 ? (
							habilidades.map(item =>
								<div key={item.habilidadeid} className="detalhe-item__subtitens">
									<div className="detalhe-item__subtitem">
										<p className="detalhe-item__label">Habilidades:</p>
										<p className="detalhe-item__value">{item.habilidade}</p>
									</div>
									<div className="detalhe-item__subtitem">
										<p className="detalhe-item__label">Nível:</p>
										<p className="detalhe-item__value">{item.nivel}</p>
									</div>
								</div>
							)
						) : <p className="mensagem">Habilidades não cadastradas</p>
					}
				</div>
				<div className="detalhe-item">
					<p className="subtitle subtitle-subtite">Idiomas:</p>
					{
						idiomas && idiomas.length > 0 ? (
							idiomas.map(item =>
								<div key={item.idiomaid} className="detalhe-item__subtitens">
									<div className="detalhe-item__subtitem">
										<p className="detalhe-item__label">Idiomas:</p>
										<p className="detalhe-item__value">{item.idioma}</p>
									</div>
									<div className="detalhe-item__subtitem">
										<p className="detalhe-item__label">Nível:</p>
										<p className="detalhe-item__value">{item.nivel}</p>
									</div>
								</div>
							)
						) : <p className="mensagem">Idiomas não cadastrados</p>
					}
				</div>
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
					<CurriculoFormulario callback={callback} edit={true} data={editData} usuario={usuario} />
				) : ''
			}
		</div>
	)
}

export default CurriculoDetalhe