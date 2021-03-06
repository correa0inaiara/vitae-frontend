import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteUserSelectionProcess, getAllApplicationsByVacancy, getCSVExport } from '../data/ApiService'
import ProcessoSeletivoFormulario from './ProcessoSeletivoFormulario'

const ProcessoSeletivoDetalhe = ({ callback, data, index, usuario }) => {
	const [nome, setNome] = useState(data.nome)
	const [descricao, setDescricao] = useState(data.descricao)
	const [vagaSelecionada, setVagaSelecionada] = useState(data.vagaid)
	const [vaga, setVagaSalario] = useState(data.vaga.nome)
	
	const [temCandidaturas, setTemCandidaturas] = useState(false);
	const [processoSeletivoData, setProcessoSeletivoData] = useState(data)

	const [edit, setEdit] = useState(false)
	const [editData, setEditData] = useState(false)
	const navigate = useNavigate()

	const handleDelete = async function (event) {
		const result = await deleteUserSelectionProcess(data.processoseletivoid, usuario.token)
		callback()
	}

	const handleEdit = function (event) {
		setEdit(true)
		const dataEdit = {
			nome: nome,
			descricao: descricao,
			vagaSelecionada: vagaSelecionada,
			processoSeletivoId: data.processoseletivoid
		}
		setEditData(dataEdit)
	}

	const handleInicioProcessoSeletivo = function () {
		
		localStorage.setItem('processoSeletivoData', JSON.stringify(processoSeletivoData))

		const _processoSeletivoData = localStorage.getItem('processoSeletivoData')
		if (_processoSeletivoData) {
			navigate('/processos-seletivos/etapa-1')
		}
	}

	useEffect(() => {
		async function getCandidaturas() {
			const candidaturas = await getAllApplicationsByVacancy(vagaSelecionada, usuario.token)
			if (candidaturas && candidaturas.length > 0) {
				setTemCandidaturas(true)
			} else {
				setTemCandidaturas(false)
			}
		}	
		getCandidaturas()
	}, [])
	
	const handleExport = async function (item) {
		const filename = `processosseletivos-${processoSeletivoData.processoseletivoid}.csv`
		const result = await getCSVExport('processosseletivos', processoSeletivoData.processoseletivoid, filename, usuario.token)
	}
	
	return (
		<div key={index} className="detalhe">
			<div className="detalhes-">
				<h3 className="detalhes-vaga__title">Sobre a Vaga</h3>
				<div className="detalhe-item">
					<p className="detalhe-item__label">Nome:</p>
					<p className="detalhe-item__value">{nome}</p>
				</div>
				<div className="detalhe-item">
					<p className="detalhe-item__label">Descri????o:</p>
					<p className="detalhe-item__value">{descricao}</p>
				</div>
				<div className="detalhe-item">
					<p className="detalhe-item__label">Vaga:</p>
					<p className="detalhe-item__value">{vaga}</p>
				</div>
			</div>
			<div className="buttons">
				<button 
					onClick={handleExport}
					className="button button--blue">
						Exportar CSV
				</button>
				<button 
					onClick={handleEdit}
					className="button button--yellow">
						Editar
				</button>
				<button 
					onClick={handleDelete}
					className="button button--red">
						Delete
				</button>
				{
					temCandidaturas ? (
						<button 
							onClick={handleInicioProcessoSeletivo}
							className="button button--purple">
								Iniciar Processo Seletivo
						</button>
					) : <p className="mensagem">N??o ?? poss??vel iniciar o processo seletivo para essa vaga ainda, pois n??o possui candidaturas.</p>
				}
			</div>
			{
				edit ? (
					<ProcessoSeletivoFormulario edit={true} callback={callback} data={editData} />
				) : ''
			}
		</div>
	)
}
export default ProcessoSeletivoDetalhe