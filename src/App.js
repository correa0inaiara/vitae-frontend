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
import './estilos/agendamentos.css';
import './estilos/curriculo.css';
import './estilos/questionarios.css';
import './estilos/acessoNegado.css';
import './estilos/footer.css';
import './estilos/loader.css';
import './estilos/vaga.css';
import './estilos/lista.css';
import './estilos/processoSeletivo.css';
import './estilos/dashboard.css';

import MainRoutes from './Routes'

export default function App() {

	return (
		<div className='app'>
			<MainRoutes />
		</div>
	);
}