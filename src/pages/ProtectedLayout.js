import { Navigate, Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

export const ProtectedLayout = (props) => {

	const useAuth = () => {
		const user = localStorage.getItem('user')
		if (user) {
			const _user = JSON.parse(user)
			return {
				auth: true,
				role: _user.tipoUsuario
			}
		} else {
			return {
				auth: false,
				role: null
			}
		}
	}

	const {auth, role} = useAuth()

	return (
		<>
			<div className="wrapper">
				<Header />
				{
						props.role ? (
							auth ? (
								props.role === role ? (
									<Outlet />
								) : (
									<Navigate to="/denied" />
								)
							) : (
								<Navigate to="login" />
							)
						) : (
							auth ? <Outlet /> : <Navigate to="/login" />
						)
				}

			</div>
			<Footer />
		</>
	)
};