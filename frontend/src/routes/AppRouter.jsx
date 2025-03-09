import { Navigate, Route, Routes, BrowserRouter, Outlet } from "react-router"

import ROUTES from "./ROUTES"

import LoginProtectedRoutes from "./protected-routes/LoginProtectedRoutes"
import Dashboard from "../views/dashboard/Dashboard"
import AppLayout from "../layouts/AppLayout"
import Login from "../views/login/Login"
import DashboardEvent from "../views/dashboard-event/DashboardEvent"

const AppRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				{/* Rutas públicas */}
				<Route path={ROUTES["AUTH"]} element={<Outlet />}>
					<Route path={ROUTES["LOGIN"]} element={<Login />} />
				</Route>

				{/* Rutas protegidas */}
				<Route element={<LoginProtectedRoutes />}>
					<Route path={ROUTES["APP"]} element={<AppLayout />}>
						<Route path={ROUTES["DASHBOARD"]} element={<Dashboard />} />
						<Route
							path={ROUTES["DASHBOARD_EVENT"]}
							element={<DashboardEvent />}
						/>
					</Route>
				</Route>

				{/* Ruta de captura para URLs no encontradas */}
				<Route
					path="*"
					element={<Navigate to={ROUTES["DASHBOARD"]} replace />}
				/>
			</Routes>
		</BrowserRouter>
	)
}

export default AppRouter
