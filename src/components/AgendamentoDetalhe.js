import React from 'react'

const AgendamentoDetalhe = ({data, index, usuario}) => {
	return (
		<div key={index} className="detalhes-agendamento">
			<div className="detalhe-item">
				<span className="detalhe-item__label">Motivo:</span>
				<span className="detalhe-item__value">{data.motivo}</span>
			</div>
			{
				usuario.tipoUsuario === 'Candidato' ? (
					<div className="detalhe-item">
						<span className="detalhe-item__label">Empresa:</span>
						<span className="detalhe-item__value">{data.nomedaempresa}</span>
					</div>
				) : (
					<div className="detalhe-item">
						<span className="detalhe-item__label">Candidato:</span>
						<span className="detalhe-item__value">{data.nomecompleto}</span>
					</div>
				)
			}
			<div className="detalhe-item">
				<span className="detalhe-item__label">Dia:</span>
				<span className="detalhe-item__value">{data.dia}</span>
			</div>
			<div className="detalhe-item">
				<span className="detalhe-item__label">Hora:</span>
				<span className="detalhe-item__value">{data.hora}</span>
			</div>
			<div className="detalhe-item">
				<span className="detalhe-item__label">Localização: </span>
				<span className="detalhe-item__value">{data.localizacao}</span>
			</div>
		</div>
	)
}

export default AgendamentoDetalhe