import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Divider,
} from "@mui/material";

const EventStatsChart = ({ events, socialStats }) => {
  if (!events || events.length === 0) {
    return (
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">
              No hay datos de eventos disponibles
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  }

  // Procesar datos de eventos y posts por categoría
  const categoryData = events.reduce((acc, event) => {
    if (!acc[event.category]) {
      acc[event.category] = {
        totalEvents: 0,
        uniqueCities: new Set(),
        totalPrices: 0,
        futureEvents: 0,
        // Métricas de posts
        events: new Set(), // Guardamos los eid de los eventos
        totalPosts: 0,
        totalReach: 0,
        totalImpressions: 0,
        totalEngagement: 0,
        totalInteractions: 0,
      };
    }

    // Datos del evento
    acc[event.category].totalEvents += 1;
    acc[event.category].uniqueCities.add(event.city.toLowerCase());
    acc[event.category].totalPrices += parseFloat(event.price) || 0;
    acc[event.category].events.add(event.eid); // Añadimos el eid

    if (event.timeUnix > Date.now()) {
      acc[event.category].futureEvents += 1;
    }

    return acc;
  }, {});

  // Procesar los posts y asociarlos con las categorías a través del eid
  if (socialStats && categoryData) {
    socialStats.forEach((post) => {
      // Verificar que el post tenga la propiedad 'eid'
      if (!post.eid) return;

      // Buscar en qué categoría está el eid del post
      for (const [category, data] of Object.entries(categoryData)) {
        if (data.events.has(post.eid.id)) {
          data.totalPosts += 1;
          data.totalReach += post.reach || 0;
          data.totalImpressions += post.impressions || 0;
          console.log("🟢 DATA totalImpressions:", data.totalImpressions);

          // Asegurarse de que las interacciones sean números
          const interactions =
            (post.likes || 0) + (post.comments || 0) + (post.shares || 0);
          data.totalInteractions += interactions;
          console.log("🟢 DATA totalInteractions:", data.totalInteractions);

          // Solo calcular totalEngagement si reach es válido (mayor que 0)
          if (post.reach > 0) {
            data.totalEngagement += (interactions / post.reach) * 100;
          }
          console.log("🟢 DATA totalEngagement:", data.totalEngagement);

          break; // Un post solo puede pertenecer a un evento
        }
      }
      console.log("🟢 POST1:", post);
    });
  }

  // Preparar datos para el gráfico
  const data = Object.entries(categoryData).map(([category, stats]) => {
    const postsCount = stats.totalPosts || 1; // Evitar división por cero
    return {
      category,
      "Total Eventos": stats.totalEvents,
      Ciudades: stats.uniqueCities.size,
      "Precio Medio": +(stats.totalPrices / stats.totalEvents).toFixed(2),
      "Eventos Futuros": stats.futureEvents,
      Posts: stats.totalPosts,
      // Métricas promedio de posts
      "Alcance Medio": Math.round(stats.totalReach / postsCount),
      "Impresiones Medias": Math.round(stats.totalImpressions / postsCount),
      "Engagement Medio": +(stats.totalEngagement / postsCount).toFixed(2),
    };
  });

  return (
    <Grid container spacing={3}>
      {/* Gráfica de Métricas de Eventos */}
      <Grid item xs={12} md={6} sx={{ width: "100%" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Distribución de Eventos por Categoría
          </Typography>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 70,
              }}
            >
              <XAxis
                dataKey="category"
                angle={0}
                textAnchor="middle"
                height={8}
                interval={0}
                tick={{ fill: "#666", fontSize: 13 }}
              />
              <YAxis
                label={{
                  value: "Cantidad",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  fontSize: 13,
                }}
                tick={{ fill: "#666" }}
                fontSize={13}
              />
              <Tooltip
                formatter={(value, name) => [value.toLocaleString(), name]}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar
                dataKey="Total Eventos"
                fill="#8884d8"
                name="Total Eventos"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Eventos Futuros"
                fill="#82ca9d"
                name="Eventos Futuros"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Ciudades"
                fill="#ffc658"
                name="Ciudades"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Grid>

      {/* Gráfica de Métricas de Rendimiento */}
      <Grid item xs={12} md={6} sx={{ width: "100%" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Rendimiento por Categoría
          </Typography>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 70,
              }}
            >
              <XAxis
                dataKey="category"
                angle={0}
                textAnchor="middle"
                height={8}
                interval={0}
                tick={{ fill: "#666" }}
                fontSize={13}
              />
              <YAxis
                yAxisId="left"
                label={{
                  value: "Alcance e Impresiones",
                  angle: -90,
                  position: "insideLeft",
                  offset: -5,
                  fontSize: 13,
                }}
                tick={{ fill: "#666" }}
                fontSize={13}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: "Engagement y Precio",
                  angle: 90,
                  position: "insideRight",
                  offset: 10,
                  fontSize: 13,
                }}
                tick={{ fill: "#666" }}
                fontSize={13}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "Precio Medio") return [`${value}€`, name];
                  if (name.includes("Engagement")) return [`${value}%`, name];
                  return [value.toLocaleString(), name];
                }}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
              <Legend verticalAlign="top" height={70} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="Precio Medio"
                stroke="#8884d8"
                name="Precio Medio (€)"
                strokeWidth={2}
                dot={{ r: 4, fill: "#8884d8" }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="Engagement Medio"
                stroke="#82ca9d"
                name="Engagement Medio (%)"
                strokeWidth={2}
                dot={{ r: 4, fill: "#82ca9d" }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="Alcance Medio"
                stroke="#ffc658"
                name="Alcance Medio"
                strokeWidth={2}
                dot={{ r: 4, fill: "#ffc658" }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="Impresiones Medias"
                stroke="#8884d8"
                name="Impresiones Medias"
                strokeWidth={2}
                dot={{ r: 4, fill: "#8884d8" }}
                opacity={0.7}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Grid>
    </Grid>
  );
};

export default EventStatsChart;
