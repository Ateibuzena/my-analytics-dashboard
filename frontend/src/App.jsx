import { ThemeProvider } from "@mui/material"
import { createTheme } from "@mui/material"
import CssBaseline from "@mui/material/CssBaseline"

import AppRouter from "./routes/AppRouter"

const theme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: "#1976d2",
		},
		secondary: {
			main: "#dc004e",
		},
		background: {
			default: "#fafafab0",
		},
	},
})

function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AppRouter />
		</ThemeProvider>
	)
}

export default App
