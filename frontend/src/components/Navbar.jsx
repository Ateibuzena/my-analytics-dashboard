import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { collection, query, getDocs, where } from "firebase/firestore"
import { signOut } from "firebase/auth"
import {
	Card,
	CardContent,
	Avatar,
	Typography,
	Button,
	Box,
} from "@mui/material"

import { auth, db } from "../firebase"
import ROUTES from "../routes/ROUTES"

const Navbar = () => {
	const navigate = useNavigate()
	const [userData, setUserData] = useState(null)

	useEffect(() => {
		const fetchUserData = async () => {
			const userRef = collection(db, "users")
			const userSnap = await getDocs(
				query(userRef, where("uid", "==", auth.currentUser.uid))
			)

			if (userSnap.empty) {
				console.warn("⚠️ No se encontró el usuario.")
				return
			}

			const userData = userSnap.docs[0].data()
			setUserData(userData)
		}

		fetchUserData()
	}, [])

	const handleLogout = async () => {
		try {
			await signOut(auth)
			navigate(ROUTES["LOGIN"])
		} catch (error) {
			console.error("Error al cerrar sesión:", error)
		}
	}
	return (
		<Card sx={{}}>
			<CardContent
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 2,
					justifyContent: "space-between",
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
					<Avatar src={userData?.photoURL} sx={{ width: 64, height: 64 }} />
					<Box>
						<Typography variant="h5">{userData?.name}</Typography>
						<Typography color="textSecondary">{userData?.email}</Typography>
					</Box>
				</Box>
				<Button variant="contained" color="error" onClick={handleLogout}>
					Cerrar Sesión
				</Button>
			</CardContent>
		</Card>
	)
}

export default Navbar
