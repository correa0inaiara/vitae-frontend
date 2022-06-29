import React, { useState } from 'react'
import Login from '../components/Login';
import { getAllUsers } from '../data/ApiService';
import useToken from '../hooks/useToken';
import useUser from '../hooks/useUser';

const Perfil = () => {
	// const {usuarios, setUsuarios} = useState();
	// const {user, setUser} = useUser();
	// const {token, setToken} = useToken();

	// if (typeof token === 'undefined' || token?.length === 0) {
	// 	return <Login setToken={setToken} setUser={setUser} />
	// }

	// const getUsers = async function () {
	// 	const result = await getAllUsers();
	// 	if (result) setUsuarios(result);
	// 	return usuarios
	// }

  return (
	<div className="perfil">
		Perfil
		
		{/* {{getUsers}} */}
	</div>
  )
}

export default Perfil