import React from "react"
import {
	Grid,
	Card,
	CardContent,
	CardMedia,
	Typography,
	Box,
	Chip,
	Divider,
	CardActionArea,
	Avatar,
	IconButton,
} from "@mui/material"
import { alpha, styled } from "@mui/material/styles"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import EuroIcon from "@mui/icons-material/Euro"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import { useNavigate } from "react-router-dom"
import ROUTES from "../../../../routes/ROUTES"

const StyledCard = styled(Card)(({ theme }) => ({
	height: "100%",
	display: "flex",
	flexDirection: "column",
	transition: "transform 0.3s, box-shadow 0.3s",
	"&:hover": {
		transform: "translateY(-8px)",
		boxShadow: theme.shadows[8],
	},
	position: "relative",
	overflow: "visible",
}))

const CategoryChip = styled(Chip)(({ theme }) => ({
	position: "absolute",
	top: -12,
	left: 16,
	fontWeight: "bold",
	boxShadow: theme.shadows[2],
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
}))

const PriceChip = styled(Box)(({ theme }) => ({
	position: "absolute",
	top: 16,
	right: 16,
	fontWeight: "bold",
	backgroundColor: alpha(theme.palette.background.paper, 0.85),
	color: theme.palette.text.primary,
	padding: "6px 12px",
	borderRadius: theme.shape.borderRadius,
	boxShadow: theme.shadows[3],
	display: "flex",
	alignItems: "center",
	gap: 4,
}))

const EventCard = ({ event }) => {
	const navigate = useNavigate()
	// Format date
	const eventDate = new Date(event.timeUnix)
	const formattedDate = eventDate.toLocaleDateString("es-ES", {
		weekday: "long",
		day: "numeric",
		month: "long",
	})

	const handleNavigateDashboardEvent = () => {
		navigate(ROUTES["DASHBOARD_EVENT"].replace(":eid", event.eid))
	}

	return (
		<Grid item xs={12} sm={6} md={4} lg={3}>
			<StyledCard elevation={3}>
				{event?.category && (
					<CategoryChip size="small" label={event.category} />
				)}

				<CardMedia
					component="img"
					height="160"
					image={event.image}
					alt={event.eventName}
					sx={{
						objectFit: "cover",
						objectPosition: "center",
						borderBottom: "4px solid",
						borderColor: "primary.main",
					}}
				/>

				<PriceChip>
					<EuroIcon fontSize="small" />
					<Typography variant="subtitle2">{event.price}</Typography>
				</PriceChip>

				<CardContent sx={{ flexGrow: 1, pt: 2 }}>
					<Typography
						variant="h6"
						component="h2"
						gutterBottom
						noWrap
						sx={{ fontWeight: "bold" }}
					>
						{event.eventName}
					</Typography>

					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							mb: 1,
							color: "text.secondary",
						}}
					>
						<CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
						<Typography variant="body2" sx={{ textTransform: "capitalize" }}>
							{formattedDate}
						</Typography>
					</Box>

					<Box
						sx={{
							display: "flex",
							alignItems: "flex-start",
							mb: 2,
							color: "text.secondary",
						}}
					>
						<LocationOnIcon fontSize="small" sx={{ mr: 1, mt: 0.3 }} />
						<Typography variant="body2">{event.place}</Typography>
					</Box>

					<Divider sx={{ my: 1.5 }} />

					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							mt: 2,
						}}
					>
						<Typography variant="caption" color="text.secondary">
							{event.city.charAt(0).toUpperCase() + event.city.slice(1)}
						</Typography>
						<IconButton
							onClick={handleNavigateDashboardEvent}
							size="small"
							color="primary"
							sx={{
								backgroundColor: (theme) =>
									alpha(theme.palette.primary.main, 0.1),
								"&:hover": {
									backgroundColor: (theme) =>
										alpha(theme.palette.primary.main, 0.2),
								},
							}}
						>
							<ArrowForwardIcon fontSize="small" />
						</IconButton>
					</Box>
				</CardContent>
			</StyledCard>
		</Grid>
	)
}

export default EventCard
