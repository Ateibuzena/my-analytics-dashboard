import React from "react"
import { Grid, Card, CardContent, Typography } from "@mui/material"

import EventCard from "./EventCard"

const EventSection = ({ events }) => {
	return (
		<Grid container spacing={3} sx={{ width: "100%" }}>
			<Grid item xs={12} spacing={4} sx={{ width: "100%" }}>
					<CardContent
						sx={{ display: "flex", flexDirection: "column", gap: 3 }}
					>
						<Typography variant="h6" gutterBottom>
							Próximos Eventos
						</Typography>
						<Grid container spacing={4}>
							{events.map((event) => (
								<EventCard event={event} key={event.eid} />
							))}
						</Grid>
					</CardContent>

			</Grid>
		</Grid>
	)
}

export default EventSection
