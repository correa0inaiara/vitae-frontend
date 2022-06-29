import React, { useState } from 'react'
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getApplicationById } from '../data/ApiService';

const CandidaturaDetalhe = () => {

	const [candidatura, setCandidatura] = useState([]);
	const [usuario, setUsuario] = useState([]);
	const [candidato, setCandidato] = useState([]);
	const [curriculo, setCurriculo] = useState([]);
	const [cursos, setCursos] = useState([]);
	const [educacao, setEducacao] = useState([]);
	const [experiencias, setExperiencias] = useState([]);
	const [habilidades, setHabilidades] = useState([]);
	const [idiomas, setIdiomas] = useState([]);
	const [temDados, setTemDados] = useState(false);

	const params = useParams()

	useEffect(() => {
		async function getUser() {
			const _user = localStorage.getItem("user")
			let user

			if (_user) {
				user = JSON.parse(_user)

				setUsuario(user)

				const candidatura = await getApplicationById(params.candidaturaId, user.token)

				if (candidatura) {
					
					setCandidatura(candidatura)

					if (candidatura.candidato) {
						setCandidato(candidatura.candidato)
					}
					if (candidatura.curriculo) {
						setCurriculo(candidatura.curriculo)
						setCursos(candidatura.curriculo.cursos)
						setEducacao(candidatura.curriculo.educacao)
						setExperiencias(candidatura.curriculo.experiencias)
						setHabilidades(candidatura.curriculo.habilidades)
						setIdiomas(candidatura.curriculo.idiomas)
					}
		
				}

				return candidatura
			} else {
				setTemDados(false)
				console.log('Erro ao recuperar os dados do usuário.')
				return false
			}
		}
		getUser()
	}, [])

	return (
		<div className="candidatura-detalhes">
			<div className="buttons">
				<Link
					className='detalhe-item__link' 
					to='/processos-seletivos/etapa-1'>
					<button
						className="button button--green"
						>Voltar para as Candidaturas</button>
				</Link>
			</div>
			<div className="candidatura-detalhe">
				{
					candidato ? (
						<div className="detalhe-sobre">
							<h3 className="subtitle">Sobre o Candidato</h3>
							<div className="detalhe-item">
								<p className="detalhe-item__label">Nome do Candidato:</p>
								<p className="detalhe-item__value">{candidato.nomecompleto}</p>
							</div>
							<div className="detalhe-item">
								<p className="detalhe-item__label">Profissão:</p>
								<p className="detalhe-item__value">{candidato.profissao}</p>
							</div>
							<div className="detalhe-item">
								<p className="detalhe-item__label">Data de Nascimento:</p>
								<p className="detalhe-item__value">{candidato.datanascimento}</p>
							</div>
							<div className="detalhe-item">
								<p className="detalhe-item__label">Carteira de Habilitação:</p>
								<p className="detalhe-item__value">{candidato.carteirahabilitacao ? 'Sim' : 'Não'}</p>
							</div>
							<div className="detalhe-item">
								<p className="detalhe-item__label">Website:</p>
								<p className="detalhe-item__value">{candidato.website ? candidato.website : 'Não possui website.'}</p>
							</div>
						</div>
					) : ''
				}
				{
					curriculo ? (
						<div className="detalhe-sobre">
							<h3 className="subtitle">Currículo do Candidato</h3>
							<div className="detalhe-item">
								<p className="detalhe-item__label">Nome do Currículo:</p>
								<p className="detalhe-item__value">{curriculo.nome}</p>
							</div>
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
					) : ''
				}
			</div>
		</div>
	)
}

export default CandidaturaDetalhe