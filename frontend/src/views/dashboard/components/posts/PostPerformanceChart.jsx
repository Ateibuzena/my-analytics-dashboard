import { Card, CardContent, Typography, Grid } from "@mui/material"
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	ReferenceLine,
} from "recharts"

const PostPerformanceChart = ({ socialStats }) => {
	if (!socialStats || socialStats.length === 0) {
		return (
			<Grid item xs={12} md={6} sx={{ width: "100%" }}>
				<Card>
					<CardContent>
						<Typography variant="h6">No hay datos disponibles</Typography>
					</CardContent>
				</Card>
			</Grid>
		);
	}

	const data = socialStats
		.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
		.map((post) => {
			const reachRate = ((post.reach / post.impressions) * 100);
			const engagement = ((post.likes + post.comments + post.shares) / post.reach) * 100;
			
			return {
				name: post.postName,
				fecha: new Date(post.createdAt).toLocaleDateString(),
				reach: post.reach,
				impressions: post.impressions,
				reachRate: +reachRate.toFixed(2),
				engagement: +engagement.toFixed(2),
				platform: post.platform
			};
		});

	// Calcular promedios para las líneas de referencia
	const avgReach = Math.round(data.reduce((acc, item) => acc + item.reach, 0) / data.length);
	const avgImpressions = Math.round(data.reduce((acc, item) => acc + item.impressions, 0) / data.length);
	const avgReachRate = +(data.reduce((acc, item) => acc + item.reachRate, 0) / data.length).toFixed(2);

	return (
		<Grid item xs={12} md={6} sx={{ width: "120%" }}>
				<CardContent>
					<Typography variant="h6" gutterBottom>
						Rendimiento por Post
					</Typography>
					<ResponsiveContainer width="120%" height={500}>
						<LineChart 
							data={data}
							margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
						>
							<XAxis 
								dataKey="name"
								angle={0}
								textAnchor="middle"
								height={40}
								interval={0}
							/>
							<YAxis 
								yAxisId="left"
								label={{ 
									value: 'Impresiones y Alcance', 
									angle: -90, 
									position: 'insideLeft',
									offset: -5
								}}
							/>
							<YAxis 
								yAxisId="right" 
								orientation="right"
								label={{ 
									value: 'Tasa (%)', 
									angle: 90, 
									position: 'insideRight',
									offset: 10
								}}
							/>
							<Tooltip 
								formatter={(value, name) => {
									const labels = {
										impressions: ["Impresiones", value.toLocaleString()],
										reach: ["Alcance", value.toLocaleString()],
										reachRate: ["Tasa de Alcance", `${value}%`],
										engagement: ["Engagement", `${value}%`]
									};
									return labels[name] || [name, value];
								}}
								labelFormatter={(label, payload) => {
									if (payload && payload[0]) {
										return `${label} (${payload[0].payload.fecha})`;
									}
									return label;
								}}
							/>
							<Legend 
								verticalAlign="top"
								height={60}
								formatter={(value) => {
									const labels = {
										impressions: "Impresiones",
										reach: "Alcance",
										reachRate: "Tasa de Alcance (%)",
										engagement: "Engagement (%)"
									};
									return labels[value] || value;
								}}
							/>
							
							{/* Líneas de referencia para promedios */}
							<ReferenceLine 
								y={avgImpressions} 
								yAxisId="left" 
								stroke="#8884d8" 
								strokeDasharray="3 3"
								label={{ 
									value: `Promedio: ${avgImpressions.toLocaleString()}`,
									fill: '#8884d8',
									position: 'insideLeft'
								}}
							/>
							<ReferenceLine 
								y={avgReach} 
								yAxisId="left" 
								stroke="#82ca9d" 
								strokeDasharray="3 3"
								label={{ 
									value: `Promedio: ${avgReach.toLocaleString()}`,
									fill: '#82ca9d',
									position: 'insideRight'
								}}
							/>

							<Line
								yAxisId="left"
								type="monotone"
								dataKey="impressions"
								stroke="#8884d8"
								strokeWidth={2}
								dot={{ r: 4 }}
								activeDot={{ r: 8 }}
							/>
							<Line
								yAxisId="left"
								type="monotone"
								dataKey="reach"
								stroke="#82ca9d"
								strokeWidth={2}
								dot={{ r: 4 }}
								activeDot={{ r: 8 }}
							/>
							<Line
								yAxisId="right"
								type="monotone"
								dataKey="reachRate"
								stroke="#ffc658"
								strokeWidth={2}
								dot={{ r: 4 }}
								activeDot={{ r: 8 }}
							/>
							<Line
								yAxisId="right"
								type="monotone"
								dataKey="engagement"
								stroke="#ff6b6b"
								strokeWidth={2}
								dot={{ r: 4 }}
								activeDot={{ r: 8 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</CardContent>
		</Grid>
	);
};

export default PostPerformanceChart;
