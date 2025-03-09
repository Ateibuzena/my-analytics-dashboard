import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart, Area
} from "recharts";

import { Timestamp } from "firebase/firestore";

// Este componente se enfocará en las métricas absolutas y su distribución
const IteractionsChart = ({ socialStats }) => {
  if (!socialStats || socialStats.length === 0) {
    return <div>No hay datos disponibles</div>;
  }
  

  const data = socialStats
  .slice()
  .sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis()) // Comparar timestamps
  .map((post) => { 
    const totalInteractions = post.likes + post.comments + post.shares;

    return {
      name: post.postName,
      platform: post.platform,
      createdAt: post.createdAt.toDate().toLocaleDateString(), // Convertir a fecha legible
      likes: post.likes,
      comments: post.comments,
      shares: post.shares,
      totalInteractions,
      reach: post.reach,
      likesRatio: Number(((post.likes / totalInteractions) * 100).toFixed(1)),
      commentsRatio: Number(((post.comments / totalInteractions) * 100).toFixed(1)),
      sharesRatio: Number(((post.shares / totalInteractions) * 100).toFixed(1)),
    };
  }); 



  return (
    <ResponsiveContainer width="100%" height={500}>
      <AreaChart data={data}>
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12, angle: 0, textAnchor: "end" }} 
          interval={0} 
          height={80} 
        />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend 
          formatter={(value, entry) => {
            const labels = {
              likes: "Me gusta",
              comments: "Comentarios",
              shares: "Compartidos"
            };
            return <span style={{ color: entry.color }}>{labels[value] || value}</span>;
          }}
        />

        <Area 
          type="monotone" 
          dataKey="likes" 
          fill="#8884d8" 
          stroke="#8884d8"
          fillOpacity={0.3}
        />
        <Area 
          type="monotone" 
          dataKey="comments" 
          fill="#82ca9d" 
          stroke="#82ca9d"
          fillOpacity={0.3}
        />
        <Area 
          type="monotone" 
          dataKey="shares" 
          fill="#ffc658" 
          stroke="#ffc658"
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
export default IteractionsChart;
