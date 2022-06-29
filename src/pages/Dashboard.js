import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';



const Dashboard = () => {
	const [usuario, setUsuario] = useState();
	const [tipoUsuario, setTipoUsuario] = useState();

	useEffect(() => {
		async function getUser() {
			const _user = localStorage.getItem("user")
			let user

			if (_user) {
				user = JSON.parse(_user)
				setUsuario(user)
				const tipoUsuario = user.tipoUsuario
				setTipoUsuario(tipoUsuario)

				return user
			} else {
				console.log('Erro ao recuperar os dados do usuário.')
				return false
			}
		}
		getUser()
	}, [])

	/* 
		empresa: 
		 - questionarios
		 - vagas
		 - processos seletivos
		  - selecao de candidatos
		  - agendamentos
		 - todas as vagas
		candidato:
		 - curriculos
		 - visualizar agendamentos
		 - todas as vagas
	*/

	return (
		<div className="dashboard">
			<h1 className="title">{
				`Olá, ${tipoUsuario === 'Candidato' ? 'candidato' : 'empresa'}!`
			}</h1>
			<h2 className="subtitle subtitle--center">Conheça um pouco mais dos nossos serviços</h2>
			<ul className="dashboard-list">
				<p className="mensagem mensagem--big-margin">Abaixo você encontra uma breve explicação do que esperar de cada página</p>
				{
					tipoUsuario === 'Candidato' ? (
						<>
							<li className="dashboard-list__item">
								<p className="mensagem">Na página de currículos você poderá cadastrar quantos currículos quiser, e ao se candidatar à alguma vaga poderá escolher qual deles enviar.</p>
								<div className="buttons">
									<Link 
										to='/curriculos'>
										<button
											className="button button--blue"
											>Currículos</button>
									</Link>
								</div>
							</li>
							<li className="dashboard-list__item">
								<p className="mensagem">Após se candidatar, as empresas receberam a sua candidatura e os detalhes do currículo que você enviou. Após o final do processo seletivo, se você for escolhido, a empresa poderá agendar uma entrevista com você. Cheque nesse link quando quiser saber se foi escolhido ou não.</p>
								<div className="buttons">
									<Link 
										to='/agendamentos'>
										<button
											className="button button--blue"
											>Agendamentos</button>
									</Link>
								</div>
							</li>
							<li className="dashboard-list__item">
								<p className="mensagem">E aqui, finalmente, é onde você encontra todas as vagas disponíveis para você se candidatar e enviar os seus currículos.</p>
								<div className="buttons">
									<Link 
										to='/vagas/todas'>
										<button
											className="button button--blue"
											>Todas as Vagas</button>
									</Link>
								</div>
							</li>
						</>
					) : (
						<>
							<li className="dashboard-list__item">
								<p className="mensagem">Na página de Questionários você poderá cadastrar quantos questionários quiser, e ao cadastrar uma vaga poderá atribuir um deles.</p>
								<div className="buttons">
									<Link 
										to='/questionarios'>
										<button
											className="button button--blue"
											>Questionários</button>
									</Link>
								</div>
							</li>
							<li className="dashboard-list__item">
								<p className="mensagem">Na página de Vagas, assim como em questionários, você poderá gerenciar suas vagas como quiser. E elas aparecerão na página de Todas as Vagas para que os candidatos possam se candidatar à elas.</p>
								<div className="buttons">
									<Link 
										to='/vagas'>
										<button
											className="button button--blue"
											>Vagas</button>
									</Link>
								</div>
							</li>
							<li className="dashboard-list__item">
								<p className="mensagem">Em Processos Seletivos, você poderá criar um para cada vaga criada. Mas, somente para aquelas vagas que já possuem candidaturas realizadas. Caso possua candidaturas, poderá iniciar o processo seletivo, e será redirecionado para a primeira etapa do processo seletivo, em que poderá ver as candidaturas para a vaga em questão, os detahes do candidato e do currículo enviado, assim como escolher quais candidatos poderão evoluir para a próxima etapa. A segunda etapa, então do processo seletivo, consiste em agendar as entrevistas com os candidatos escolhidos por você na etapa anterior.</p>
								<div className="buttons">
									<Link 
										to='/processos-seletivos'>
										<button
											className="button button--blue"
											>Vagas</button>
									</Link>
								</div>
							</li>
							<li className="dashboard-list__item">
								<p className="mensagem">Em Processos Seletivos, você poderá criar um para cada vaga criada. Mas, somente para aquelas vagas que já possuem candidaturas realizadas. Caso possua candidaturas, poderá iniciar o processo seletivo, e será redirecionado para a primeira etapa do processo seletivo, em que poderá ver as candidaturas para a vaga em questão, os detahes do candidato e do currículo enviado, assim como escolher quais candidatos poderão evoluir para a próxima etapa. A segunda etapa, então do processo seletivo, consiste em agendar as entrevistas com os candidatos escolhidos por você na etapa anterior.</p>
								<div className="buttons">
									<Link 
										to='/processos-seletivos'>
										<button
											className="button button--blue"
											>Vagas</button>
									</Link>
								</div>
							</li>
							<li className="dashboard-list__item">
								<p className="mensagem">E aqui, finalmente, é onde você encontra todas as vagas disponíveis, tanto as criadas por você quanto as de outras empresas.</p>
								<div className="buttons">
									<Link 
										to='/vagas/todas'>
										<button
											className="button button--blue"
											>Todas as Vagas</button>
									</Link>
								</div>
							</li>
						</>
					)
				}
			</ul>
		</div>
	)
}

export default Dashboard