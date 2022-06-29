import { Link, Navigate, Outlet } from "react-router-dom";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Header from "../components/Header";

export const AcessoNegado = (props) => {

	return (
		<>
			<div className="wrapper">
				<Header />
				
				<div className="acesso-negado">
					<p className="acesso-negado__text">Você não tem permissão para acessar esta página.</p>
					<div className="buttons">
						<Link 
							className="acesso-negado__button"
							to='/'>
							<Button buttonClass='button button--green' buttonText='Ir para a Home' />
						</Link>
					</div>
				</div>

				<Outlet />
			</div>
			<Footer />
		</>
	)
};