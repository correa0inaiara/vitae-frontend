import { Navigate, Outlet, useLocation } from "react-router-dom";

export const ProtectedRoutes = (props) => {

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
	const location = useLocation()

	return (
		<>
			<div className="wrapper">
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
		</>
	)
};