import { useState } from "react"

import {
	auth,
	provider,
	signInWithPopup,
	db,
	doc,
	setDoc,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "../../firebase"
import { useNavigate } from "react-router-dom"
import {
	Box,
	Button,
	Container,
	Typography,
	Paper,
	TextField,
	Divider,
	Alert,
} from "@mui/material"
import GoogleIcon from "@mui/icons-material/Google"
import ROUTES from "../../routes/ROUTES"

const Login = () => {
	const navigate = useNavigate()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const [isRegistering, setIsRegistering] = useState(false)

	const handleEmailLogin = async (e) => {
		e.preventDefault()
		setError("")

		try {
			let userCredential

			if (isRegistering) {
				// Crear nuevo usuario
				userCredential = await createUserWithEmailAndPassword(
					auth,
					email,
					password
				)
			} else {
				// Iniciar sesión con usuario existente
				userCredential = await signInWithEmailAndPassword(auth, email, password)
			}

			const user = userCredential.user

			// Guardar usuario en Firestore
			await setDoc(
				doc(db, "users", user.uid),
				{
					email: user.email,
					uid: user.uid,
					name: user.displayName || email.split("@")[0], // Usar parte del email como nombre si no hay displayName
					photoURL: user.photoURL || null,
				},
				{ merge: true }
			)

			navigate(ROUTES["DASHBOARD"])
		} catch (error) {
			console.error("Error:", error)
			setError(
				error.code === "auth/user-not-found"
					? "Usuario no encontrado"
					: error.code === "auth/wrong-password"
					? "Contraseña incorrecta"
					: error.code === "auth/email-already-in-use"
					? "El email ya está registrado"
					: "Error en la autenticación"
			)
		}
	}

	const handleLogin = async () => {
		try {
			const result = await signInWithPopup(auth, provider)
			const user = result.user

			// Guardar usuario en Firestore
			await setDoc(
				doc(db, "users", user.uid),
				{
					name: user.displayName,
					email: user.email,
					photoURL: user.photoURL,
					uid: user.uid,
				},
				{ merge: true }
			)

			console.log("Usuario guardado en Firestore:", user)
			navigate(ROUTES["DASHBOARD"])
		} catch (error) {
			console.error("Error en el login:", error)
		}
	}

	return (
		<Container component="main" maxWidth="xs">
			<Box
				sx={{
					marginTop: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Paper
					elevation={3}
					sx={{
						padding: 4,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						width: "100%",
					}}
				>
					<Typography component="h1" variant="h5" gutterBottom>
						My Analytics
					</Typography>

					{error && (
						<Alert severity="error" sx={{ width: "100%", mb: 2 }}>
							{error}
						</Alert>
					)}

					<form onSubmit={handleEmailLogin} style={{ width: "100%" }}>
						<TextField
							margin="normal"
							required
							fullWidth
							label="Email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							label="Contraseña"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
							{isRegistering ? "Registrarse" : "Iniciar sesión"}
						</Button>
					</form>

					<Button
						onClick={() => setIsRegistering(!isRegistering)}
						sx={{ mt: 1 }}
					>
						{isRegistering
							? "¿Ya tienes cuenta? Inicia sesión"
							: "¿No tienes cuenta? Regístrate"}
					</Button>

					<Divider sx={{ width: "100%", my: 2 }}>o</Divider>

					<Button
						variant="contained"
						startIcon={<GoogleIcon />}
						onClick={handleLogin}
						fullWidth
						sx={{ mt: 1 }}
					>
						Iniciar sesión con Google
					</Button>
				</Paper>
			</Box>
		</Container>
	)
}

export default Login
