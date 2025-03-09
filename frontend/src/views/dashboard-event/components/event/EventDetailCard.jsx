import React from "react"

import {
	Box,
	Button,
	Card,
	CardContent,
	CardMedia,
	Chip,
	Divider,
	Grid,
	Paper,
	Stack,
	Typography,
} from "@mui/material"
import Skeleton from "@mui/material/Skeleton"
import EuroIcon from "@mui/icons-material/Euro"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus"
import LinkIcon from "@mui/icons-material/Link"

const EventDetailCard = ({ event, loading }) => {
	// Format date
	const formatEventDate = (timestamp) => {
		if (!timestamp) return "Fecha por determinar"

		const eventDate = new Date(timestamp)
		return eventDate.toLocaleDateString("es-ES", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		})
	}

	console.log("🟢 EVENT:", event)

	return loading ? (
		<Card elevation={3}>
			<Skeleton variant="rectangular" height={300} />
			<CardContent>
				<Skeleton variant="text" height={60} width="80%" />
				<Skeleton variant="text" height={30} width="40%" />
				<Skeleton variant="text" height={30} width="60%" />
				<Skeleton variant="rectangular" height={120} />
			</CardContent>
		</Card>
	) : (
		<Paper
			elevation={3}
			sx={{
				mb: 4,
				overflow: "hidden",
				borderRadius: 2,
			}}
		>
			<Grid container>
				<Grid item xs={12} md={5}>
					<Box sx={{ position: "relative", height: "100%", minHeight: 300 }}>
						<CardMedia
							component="img"
							image={event.image}
							alt={event.eventName}
							sx={{
								height: "100%",
								objectFit: "cover",
							}}
						/>
						<Box
							sx={{
								position: "absolute",
								top: 16,
								left: 16,
								display: "flex",
								gap: 1,
							}}
						>
							<Chip
								label={event.category}
								color="primary"
								sx={{ fontWeight: "bold" }}
							/>
						</Box>
						<Box
							sx={{
								position: "absolute",
								bottom: 16,
								right: 16,
								display: "flex",
								alignItems: "center",
								backgroundColor: "rgba(255,255,255,0.9)",
								px: 2,
								py: 1,
								borderRadius: 1,
								boxShadow: 2,
							}}
						>
							<EuroIcon fontSize="small" sx={{ mr: 0.5 }} />
							<Typography variant="h6" fontWeight="bold">
								{event.price}
							</Typography>
						</Box>
					</Box>
				</Grid>

				<Grid item xs={12} md={7}>
					<Box sx={{ p: 3 }}>
						<Typography
							variant="h4"
							component="h1"
							gutterBottom
							fontWeight="bold"
						>
							{event.eventName}
						</Typography>

						<Stack
							direction="row"
							spacing={0.5}
							alignItems="center"
							sx={{ mb: 2, color: "text.secondary" }}
						>
							<CalendarTodayIcon fontSize="small" />
							<Typography variant="body1" sx={{ textTransform: "capitalize" }}>
								{formatEventDate(event.timeUnix)}
							</Typography>
						</Stack>

						<Stack
							direction="row"
							spacing={0.5}
							alignItems="center"
							sx={{ mb: 3, color: "text.secondary" }}
						>
							<LocationOnIcon fontSize="small" />
							<Typography variant="body1">{event.place}</Typography>
						</Stack>

						<Divider sx={{ my: 2 }} />

						<Typography variant="body1" paragraph>
							{event.description}
						</Typography>

						<Box
							sx={{
								backgroundColor: "white",
								p: 2,
								borderRadius: 1,
								mb: 2,
							}}
						>
							<Stack
								direction="row"
								spacing={1}
								alignItems="flex-start"
								sx={{ mb: 1 }}
							>
								<DirectionsBusIcon color="info" />
								<Typography variant="body2">
									<strong>Transporte público: </strong>
									{event["public-transport"]}
								</Typography>
							</Stack>

							<Stack direction="row" spacing={1} alignItems="center">
								<LocationOnIcon color="error" />
								<Typography variant="body2">
									<strong>Coordenadas: </strong>
									{event.ubicacion?._lat.toFixed(4)},{" "}
									{event.ubicacion?._long.toFixed(4)}
								</Typography>
							</Stack>
						</Box>

						<Button
							variant="contained"
							color="primary"
							endIcon={<LinkIcon />}
							href={event.link}
							target="_blank"
							fullWidth
							sx={{ mt: 2 }}
						>
							Ver en sitio oficial
						</Button>
					</Box>
				</Grid>
			</Grid>
		</Paper>
	)
}

export default EventDetailCard
