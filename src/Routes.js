import { Routes, Route } from 'react-router-dom';

import './estilos/reset.css';
import './estilos/variables.css';
import './estilos/logo.css';
import './estilos/pages.css';
import './estilos/nav.css';
import './estilos/header.css';
import './estilos/main.css';
import './estilos/cadastro.css';
import './estilos/cadastroFormulario.css';
import './estilos/button.css';
import './estilos/shape.css';

import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Curriculos from './components/Curriculos';
import Agendamentos from './components/Agendamentos';
import {ProtectedRoutes} from './components/ProtectedRoutes';

import Home from './pages/Home';
import { ProtectedLayout } from './pages/ProtectedLayout';
import { HomeLayout } from './pages/HomeLayout';
import Questionarios from './components/Questionarios';
import { AcessoNegado } from './pages/AcessoNegado';
import Relatorios from './components/Relatorios';
import Vagas from './components/Vagas';
import VagasTodas from './components/VagasTodas';
import ProcessosSeletivos from './components/ProcessosSeletivos';
import ProcessoSeletivoEtapa1 from './components/ProcessoSeletivoEtapa1';
import ProcessoSeletivoEtapa2 from './components/ProcessoSeletivoEtapa2';
import ProcessoSeletivoEtapa3 from './components/ProcessoSeletivoEtapa3';
import CandidaturaDetalhe from './components/CandidaturaDetalhe';
import Dashboard from './pages/Dashboard';

const MainRoutes = () => (
	<Routes>
		{/* Public Routes */}
		<Route element={<HomeLayout />}>
			<Route path='/' element={<Home />} />
			<Route path='login' element={<Login />} />
			<Route path='cadastro' element={<Cadastro />} />
		</Route>

		{/* Protected Routes */}
		<Route path='/' element={<ProtectedLayout />}>

			<Route path='dashboard' element={<Dashboard />} />
			
			<Route path='curriculos' element={<ProtectedRoutes role="Candidato" />}>
				<Route path='/curriculos' element={<Curriculos />} />
			</Route>
	
			<Route path='agendamentos' element={<Agendamentos />} />
			
			<Route path='questionarios' element={<ProtectedRoutes role="Empresa" />}>
				<Route path='/questionarios' element={<Questionarios />} />
			</Route>

			<Route path='vagas' element={<ProtectedRoutes role="Empresa" />}>
				<Route path='/vagas' element={<Vagas />} />
			</Route>

			<Route path='processos-seletivos' element={<ProtectedRoutes role="Empresa" />}>
				<Route path='/processos-seletivos' element={<ProcessosSeletivos />} />
				<Route path='/processos-seletivos/etapa-1' element={<ProcessoSeletivoEtapa1 />} />
				<Route path='/processos-seletivos/etapa-2' element={<ProcessoSeletivoEtapa2 />} />
				<Route path='/processos-seletivos/etapa-3' element={<ProcessoSeletivoEtapa3 />} />
			</Route>

			<Route path="candidaturas" element={<ProtectedRoutes role="Empresa" />}>
				<Route path="/candidaturas/:candidaturaId" element={<CandidaturaDetalhe />} />
			</Route>

			<Route path='vagas/todas' element={<VagasTodas />} />
			
			<Route path='relatorios' element={<ProtectedRoutes role="Administrador" />}>
				<Route path='/relatorios' element={<Relatorios />} />
			</Route>
			
		</Route>

		<Route path='denied' element={<AcessoNegado />} />
	</Routes>
)

export default MainRoutes