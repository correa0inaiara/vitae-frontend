import React, { useEffect, useState } from 'react'
import { getRelatorios } from '../data/ApiService';

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
	ArcElement,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const Relatorios = () => {
	const [relatorios, setRelatorios] = useState({})
	const [relatorio1, setRelatorio1] = useState()
	const [relatorio2, setRelatorio2] = useState()
	const [relatorio3, setRelatorio3] = useState()
	const [relatorio4, setRelatorio4] = useState()
	const [relatorio5, setRelatorio5] = useState()
	const [relatorio6, setRelatorio6] = useState()

	const loadRelatorios = async function (token) {
		return await getRelatorios(token)
	}


	const getRandomArbitrary = function (min, max) {
		return Math.random() * (max - min) + min;
	}

	const setGrafico1 = function (relatorioData) {

		const labels = ['Candidatos', 'Empresas', 'Administradores']
		const data = {
			labels,
			datasets: [
				{
					label: 'Usuários',
					data: [relatorioData.candidatos, relatorioData.empresas, relatorioData.administrador],
					backgroundColor: 'rgba(54, 38, 194, 0.5)',
				}
			]
		};

		setRelatorio1(data)
	}

	const setGrafico2 = function (relatorioData) {
		console.log("relatorioData", relatorioData)
		const idiomas = relatorioData
		let idiomasArr = []
		
		idiomas.filter((item, index) => idiomasArr.push(item.idioma))
		const labels = idiomasArr.filter((item, pos) => idiomasArr.indexOf(item) === pos)
		console.log('idiomas', idiomas)
		console.log('labels', labels)

		let basico = []
		let intermediario = []
		let avancado = []
		let sums = []



		// var arr = [{x:1}, {x:2}, {x:4}];
		// var result = arr.reduce(function (acc, obj) { return acc + obj.x; }, 0);
		// console.log(result);  // 7
		// basico = idiomas.reduce(function (acc, obj) { return acc + obj.basico; }, 0);
		// intermediario = idiomas.reduce(function (acc, obj) { return acc + obj.intermediario; }, 0);
		// avancado = idiomas.reduce(function (acc, obj) { return acc + obj.avancado; }, 0);
		// console.log(result);

		// let test = Object.keys(idiomas).reduce(function (previous, key) {
		// 	console.log("key", key)
		// 	console.log("previous", previous)
		// 	previous.basico += idiomas[key].basico;
		// 	previous.intermediario += idiomas[key].intermediario;
		// 	previous.avancado += idiomas[key].avancado;
		// 	sums = previous
		// 	return previous
		// }, sums);

		/**
		 * Alemão
		 * Espanhol
		 * Francês
		 * Inglês
		 */

		// let idiomasFiltrados = {
		// 	basico: 0,
		// 	intermediario: 0,
		// 	avancado: 0
		// }
		
		// let test = Object.keys(idiomas).reduce(function (previous, key) {
			// let count = idiomas[key].idioma == 'Alemão'
			// previous.count += idiomas[key].count;
			// return previous
		// }, {key: '', count: 0});

		// console.log('test', test)

		// for (var i = 0; i<idiomas.length; i++) {
		// 	for (var j = 0; j<labels.length; j++) {
		// 		if (labels[j] == idiomas[i].idioma) {
		// 			var findIndex = labels[i].find()

					// if (idiomas[i].nivel === 'Básico') {
					// 	basico.push(idiomas[i].count)
					// } else {
					// 	basico.push(0)
					// 	if (idiomas[i].nivel === 'Intermediário') {
					// 		intermediario.push(idiomas[i].count)
					// 	} else {
					// 		intermediario.push(0)
					// 		if (idiomas[i].nivel === 'Avançado') {
					// 			avancado.push(idiomas[i].count)
					// 		} else {
					// 			avancado.push(0)
					// 		}
					// 	}
					// }
					
					
		// 		}
		// 	}
		// }

		console.log('basico', basico)
		console.log('intermediario', intermediario)
		console.log('avancado', avancado)

		const data = {
			labels,
			datasets: [
				{
					label: 'Básico',
					data: basico,
					backgroundColor: 'rgba(194, 111, 38, 0.5)',
				},
				{
					label: 'Intermediário',
					data: intermediario,
					backgroundColor: 'rgba(38, 194, 194, 0.5)',
				},
				{
					label: 'Avançado',
					data: avancado,
					backgroundColor: 'rgba(194, 38, 121, 0.5)',
				}
			]
		};

		setRelatorio2(data)
	}

	const setGrafico3 = function (relatorioData) {
		const data = {
			labels: ['Entrevistas', 'Currículos', 'Processos Seletivos', 'Questionários', 'Vagas'],
			datasets: [
				{
					label: 'Total',
					data: Object.values(relatorioData),
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)',
						'rgba(255, 206, 86, 0.2)',
						'rgba(75, 192, 192, 0.2)',
						'rgba(153, 102, 255, 0.2)'
					],
					borderColor: [
						'rgba(255, 99, 132, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(255, 206, 86, 1)',
						'rgba(75, 192, 192, 1)',
						'rgba(153, 102, 255, 1)'
					],
					borderWidth: 1
				}
			]
		};

		setRelatorio3(data)
	}

	const setGrafico4 = function (relatorioData) {
		const data = {
			labels: ['Educação', 'Cursos', 'Experiências', 'Habilidades', 'Idiomas'],
			datasets: [
				{
					label: 'Total',
					data: Object.values(relatorioData),
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)',
						'rgba(255, 206, 86, 0.2)',
						'rgba(75, 192, 192, 0.2)',
						'rgba(153, 102, 255, 0.2)'
					],
					borderColor: [
						'rgba(255, 99, 132, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(255, 206, 86, 1)',
						'rgba(75, 192, 192, 1)',
						'rgba(153, 102, 255, 1)'
					],
					borderWidth: 1
				}
			]
		};

		setRelatorio4(data)
	}

	const setGrafico5 = function (candidatos, empresas) {
		const estados = Object.keys(candidatos).concat(Object.keys(empresas))
		const labels = estados.filter((item, pos) => estados.indexOf(item) === pos)
		const data = {
			labels,
			datasets: [
				{
					label: 'Candidato',
					data: Object.entries(candidatos).map(item => item[1]),
					backgroundColor: 'rgba(184, 208, 47, 0.5)',
				},
				{
					label: 'Empresas',
					data: Object.entries(empresas).map(item => item[1]),
					backgroundColor: 'rgba(41, 194, 38, 0.5)',
				}
			]
		};

		setRelatorio5(data)
	}

	useEffect(() => {
		async function getUser() {
			const _user = localStorage.getItem("user")
			let user

			if (_user) {
				user = JSON.parse(_user)

				const result = await loadRelatorios(user.token)

				// todos os relatorios
				setRelatorios(result)

				// usuarios por tipo
				// setRelatorio1(result.totalUsuariosPorTipo)
				setGrafico1(result.totalUsuariosPorTipo);

				// idiomas por nível
				setGrafico2(result.totalIdiomasPorNivel)

				// curriculos, questionarios, vagas, processos seletivos e entrevistas
				setGrafico3(result.totalCurriculosQuestionariosVagasProcessosSeletivosEntrevistas)

				// educacao, cursos, experiencias, habilidades e idiomas
				setGrafico4(result.totalEducacaoCursosExperienciasHabilidadesIdiomas)

				// candidatos e empresas por estado
				setGrafico5(result.totalCandidatosPorEstado, result.totalEmpresasPorEstado)

				return result
			} else {
				console.log('Erro ao recuperar os dados do usuário.')
				return false
			}

		}
		getUser()
	}, [])


	const getOptions = function (chartName, scales) {
		const options = {
			responsive: true,
			plugins: {
				legend: {
					position: 'top',
				},
				title: {
					display: true,
					text: chartName,
				},
			},
		};

		if (scales) {
			options.scales = {
				y:  {
					min: 0,
					max: 5,
					stepSize: 1,
				}
			}
		}
		return options
	}
	

	const text1 = 'Total de Usuários por Tipo (Candidatos x Empresas)'
	const text2 = 'Total de Idiomas por Nível (Básico, Intermediário e Avançado)'
	const text5 = 'Total de Usuários por Estado (Candidatos e Empresas)'

	return (
		<div className="relatorios">
			<h1 className="title">Relatórios</h1>

			<div className="lista-relatorios">
				{
					relatorio1 && Object.keys(relatorio1).length > 0 ? (
						<div className="relatorio">
							<Bar options={getOptions(text1)} data={relatorio1} height={300} />
						</div>
					) : ''
				}

				{
					relatorio2 && Object.keys(relatorio2).length > 0 ? (
						<div className="relatorio">
							<Bar options={getOptions(text2, true)} data={relatorio2} height={300} />
						</div>
					) : ''
				}

				{
					relatorio3 && Object.keys(relatorio3).length > 0 ? (
						<div className="relatorio">
							<Doughnut data={relatorio3} />
						</div>
					) : ''
				}

				{
					relatorio4 && Object.keys(relatorio4).length > 0 ? (
						<div className="relatorio">
							<Doughnut data={relatorio4} />
						</div>
					) : ''
				}

				{
					relatorio5 && Object.keys(relatorio5).length > 0 ? (
						<div className="relatorio">
							<Bar options={getOptions(text5)} data={relatorio5} height={300} />
						</div>
					) : ''
				}
			</div>
		</div>
	)
}

export default Relatorios