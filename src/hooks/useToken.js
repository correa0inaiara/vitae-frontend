import { useEffect, useState } from "react";

export default function useToken() {

	const [token, setToken] = useState(() => {
		const item = localStorage.getItem('token');
		if (item) {
			try {
				return JSON.parse(item);
			} catch (error) {
				return []
			}
		}
		return []
	});

	useEffect(() => {
		localStorage.setItem('token', JSON.stringify(token));
	}, [token]);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			const parsedToken = JSON.parse(token)
			setToken(parsedToken);
		}
	}, []);
	
	return {
		setToken,
		token
	}
}