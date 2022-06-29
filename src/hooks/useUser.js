import { useEffect, useState } from "react";

export default function useUser() {

	const [user, setUser] = useState(() => {
		const item = localStorage.getItem('user');
		if (item !== null) {
			try {
				return JSON.parse(item);
			} catch (error) {
				return []
			}
		}
		return []
	});

	useEffect(() => {
		localStorage.setItem('user', JSON.stringify(user));
	}, [user]);

	useEffect(() => {
		const user = localStorage.getItem('user');
		if (user) {
			const parsedUser = JSON.parse(user)
			setUser(parsedUser);
		}
	}, []);
	
	return {
		setUser,
		user
	}
}