import { Outlet } from "react-router-dom"
import { Container } from "@mui/material"
import Navbar from "../components/Navbar"

const AppLayout = () => {
	return (
		<Container
			maxWidth="lg"
			sx={{ mt: 4, mb: 4, display: "flex", flexDirection: "column", gap: 4 }}
		>
			{/* Perfil del Usuario */}
			<Navbar />
			<Outlet />
		</Container>
	)
}

export default AppLayout
