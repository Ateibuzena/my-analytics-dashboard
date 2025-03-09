import { Card, CardContent, Grid, Typography } from "@mui/material"

const MetricsCards = ({ totalStats }) => {
	return (
		<Grid container spacing={3} sx={{}}>
			<Grid item xs={12} sm={6} md={2.4}>
				<Card>
					<CardContent>
						<Typography color="textSecondary" gutterBottom>
							Total Likes
						</Typography>
						<Typography variant="h4">
							{totalStats.likes.toLocaleString()}
						</Typography>
					</CardContent>
				</Card>
			</Grid>
			<Grid item xs={12} sm={6} md={2.4}>
				<Card>
					<CardContent>
						<Typography color="textSecondary" gutterBottom>
							Comentarios
						</Typography>
						<Typography variant="h4">
							{totalStats.comments.toLocaleString()}
						</Typography>
					</CardContent>
				</Card>
			</Grid>
			<Grid item xs={12} sm={6} md={2.4}>
				<Card>
					<CardContent>
						<Typography color="textSecondary" gutterBottom>
							Compartidos
						</Typography>
						<Typography variant="h4">
							{totalStats.shares.toLocaleString()}
						</Typography>
					</CardContent>
				</Card>
			</Grid>
			<Grid item xs={12} sm={6} md={2.4}>
				<Card>
					<CardContent>
						<Typography color="textSecondary" gutterBottom>
							Impresiones
						</Typography>
						<Typography variant="h4">
							{totalStats.impressions.toLocaleString()}
						</Typography>
					</CardContent>
				</Card>
			</Grid>
			<Grid item xs={12} sm={6} md={2.4}>
				<Card>
					<CardContent>
						<Typography color="textSecondary" gutterBottom>
							Alcance
						</Typography>
						<Typography variant="h4">
							{totalStats.reach.toLocaleString()}
						</Typography>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	)
}

export default MetricsCards
