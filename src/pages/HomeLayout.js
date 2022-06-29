import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

export const HomeLayout = () => {

	return (
		<>
			<div className="wrapper">
				<Header />
				<Outlet />
			</div>
			<Footer />
		</>
	)
};