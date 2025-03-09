import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, Typography, Grid } from "@mui/material";
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff6b6b"];

const PlatformRadarChart = ({ socialStats }) => {
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

  // Reducir los datos para obtener las métricas por plataforma
  const platformStats = socialStats.reduce((acc, post) => {
    if (!acc[post.platform]) {
      acc[post.platform] = {
        impressions: 0,
        reach: 0,
        posts: 0,
        interactions: 0,
      };
    }
    acc[post.platform].impressions += post.impressions || 0;
    acc[post.platform].reach += post.reach || 0;
    acc[post.platform].posts += 1;

    // Sumar todas las interacciones
    const interactions =
      (post.likes || 0) + (post.comments || 0) + (post.shares || 0);
    acc[post.platform].interactions += interactions;

    return acc;
  }, {});

  // Preparar los datos para el gráfico
  const data = Object.entries(platformStats).map(([platform, stats]) => ({
    platform,
    "Total Posts": stats.posts,
    "Total Alcance": Math.round(stats.reach / 1000), // Convertir a miles
    "Total Interacciones": Math.round(stats.interactions / 100), // Escalar para mejor visualización
  }));

  return (
    <Grid item xs={12} md={6} sx={{ width: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Rendimiento por Plataforma
        </Typography>
        <ResponsiveContainer width="100%" height={500}>
          <RadarChart
            outerRadius={180}
            data={data}
            margin={{ top: 70, right: 30, left: 20, bottom: 20 }}
          >
            <PolarGrid gridType="circle" />
            <PolarAngleAxis
              dataKey="platform"
              tick={{ fill: "#666", fontSize: 14 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, "auto"]}
              tick={{ fill: "#666" }}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === "Total Posts") {
                  return [value, "Posts Publicados"];
                }
                if (name === "Total Alcance") {
                  return [
                    `${(value * 1000).toLocaleString()}`,
                    "Alcance Total",
                  ];
                }
                if (name === "Total Interacciones") {
                  return [
                    `${(value * 100).toLocaleString()}`,
                    "Interacciones Totales",
                  ];
                }
                return [value.toLocaleString(), name];
              }}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "8px",
                fontSize: "12px",
              }}
            />
            <Legend
              verticalAlign="top"
              align="center"
              height={36}
              wrapperStyle={{
                top: 0,
                left: 0,
                right: 0,
                paddingBottom: "20px"
              }}
              formatter={(value) => {
                const labels = {
                  "Total Posts": "Posts Publicados",
                  "Total Alcance": "Alcance Total (miles)",
                  "Total Interacciones": "Interacciones Totales (x100)",
                };
                return labels[value] || value;
              }}
            />

            <Radar
              name="Total Posts"
              dataKey="Total Posts"
              stroke={COLORS[2]}
              fill={COLORS[2]}
              fillOpacity={0.4}
            />
            <Radar
              name="Total Alcance"
              dataKey="Total Alcance"
              stroke={COLORS[1]}
              fill={COLORS[1]}
              fillOpacity={0.4}
            />
            <Radar
              name="Total Interacciones"
              dataKey="Total Interacciones"
              stroke={COLORS[0]}
              fill={COLORS[0]}
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Grid>
  );
};

export default PlatformRadarChart;
