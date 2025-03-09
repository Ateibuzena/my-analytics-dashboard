import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const EngagementChart = ({ socialStats }) => {
  if (!socialStats || socialStats.length === 0) {
    return <div>No hay datos disponibles</div>;
  }

  // Ordenar los posts por fecha usando .toMillis() para convertir el timestamp de Firebase
  const sortedData = socialStats
    .slice() // Clonamos el array para no mutarlo
    .sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis()); // Orden ascendente por fecha

  // Mapear los datos para el gráfico
  const data = sortedData.map((post) => {
    const totalInteractions = post.likes + post.comments + post.shares;

    return {
      name: post.postName,
      platform: post.platform,
      createdAt: post.createdAt.toDate().toLocaleDateString(), // Convertir a fecha legible
      engagementRate: parseFloat(((totalInteractions / post.reach) * 100).toFixed(2)),
      reachRate: parseFloat(((post.reach / post.impressions) * 100).toFixed(2)),
      virality: parseFloat(((post.shares / post.reach) * 100).toFixed(2)),
      impactRate: parseFloat(((totalInteractions / post.impressions) * 100).toFixed(2)),
    };
  });

  return (
    <ResponsiveContainer width="100%" height={500}> {/* Tamaño ajustado como en IteractionsChart */}
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12, angle: 0, textAnchor: "end" }} 
          interval={0} 
          height={80} 
        />
        <YAxis />
        <Tooltip />
        <Legend 
          formatter={(value, entry) => {
            const labels = {
              engagementRate: "Engagement Rate",
              reachRate: "Reach Rate",
              virality: "Virality",
              impactRate: "Impact Rate"
            };
            return <span style={{ color: entry.color }}>{labels[value] || value}</span>;
          }} 
        />

        {/* Engagement Rate */}
        <Area 
          type="monotone" 
          dataKey="engagementRate" 
          fill="#8884d8" 
          stroke="#8884d8"
          fillOpacity={0.3}
        />

        {/* Reach Rate */}
        <Area 
          type="monotone" 
          dataKey="reachRate" 
          fill="#82ca9d" 
          stroke="#82ca9d"
          fillOpacity={0.3}
        />

        {/* Virality */}
        <Area 
          type="monotone" 
          dataKey="virality" 
          fill="#ffc658" 
          stroke="#ffc658"
          fillOpacity={0.3}
        />

        {/* Impact Rate */}
        <Area 
          type="monotone" 
          dataKey="impactRate" 
          fill="#ff6b6b" 
          stroke="#ff6b6b"
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default EngagementChart;
