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

  // Reducir los datos para obtener las impresiones y alcance por plataforma
  const platformStats = socialStats.reduce((acc, post) => {
    if (!acc[post.platform]) {
      acc[post.platform] = {
        impressions: 0,
        reach: 0,
        posts: 0,
      };
    }
    acc[post.platform].impressions += post.impressions || 0;
    acc[post.platform].reach += post.reach || 0;
    acc[post.platform].posts += 1;
    return acc;
  }, {});

  // Preparar los datos para el gráfico
  const data = Object.entries(platformStats).map(([platform, stats]) => ({
    platform,
    "Impresiones Totales": Math.round(stats.impressions / 1000), // Convertir a miles
    "Alcance Total": Math.round(stats.reach / 1000), // Convertir a miles
    "Impresiones/Post":
      stats.posts > 0 ? Math.round(stats.impressions / stats.posts) : 0,
    "Alcance/Post": stats.posts > 0 ? Math.round(stats.reach / stats.posts) : 0,
  }));

  return (
    <Grid item xs={12} md={6} sx={{ width: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Rendimiento por Plataforma
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart
            outerRadius={150}
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
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
                if (name.includes("Totales")) {
                  return [`${value}k`, name];
                }
                return [value, name];
              }}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={2}
              formatter={(value) => {
                if (value.includes("Totales")) {
                  return `${value} (miles)`;
                }
                return value;
              }}
            />

            {/* Métricas totales */}
            <Radar
              name="Impresiones Totales"
              dataKey="Impresiones Totales"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.4}
            />
            <Radar
              name="Alcance Total"
              dataKey="Alcance Total"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.4}
            />

            {/* Métricas por post */}
            <Radar
              name="Impresiones/Post"
              dataKey="Impresiones/Post"
              stroke="#ffc658"
              fill="#ffc658"
              fillOpacity={0.4}
            />
            <Radar
              name="Alcance/Post"
              dataKey="Alcance/Post"
              stroke="#ff6b6b"
              fill="#ff6b6b"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Grid>
  );
};

export default PlatformRadarChart;
