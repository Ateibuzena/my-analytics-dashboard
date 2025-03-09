import { useState, useEffect } from "react"
import { auth } from "../../firebase"
import { Outlet, Navigate } from "react-router-dom"
import ROUTES from "../ROUTES"

const LoginProtectedRoutes = () => {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setUser(user)
			setLoading(false)
		})

		return () => unsubscribe()
	}, [])

	if (loading) {
		return <div>Cargando...</div>
	}

	if (!user) {
		return <Navigate to={ROUTES["LOGIN"]} />
	}

	return <Outlet />
}

export default LoginProtectedRoutes
