import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from 'react';
import { FormControl, Select, MenuItem, Typography } from '@mui/material';

const TimePerformanceChart = ({ socialStats }) => {
  const [timeScale, setTimeScale] = useState('daily');

  if (!socialStats) return null;

  console.log("🟢 SOCIAL STATS:", new Date(socialStats[0].createdAt.toMillis()));

  const getTimeData = () => {
    switch(timeScale) {
      case 'daily':
        return Array.from({ length: 24 }, (_, hour) => {
          const postsAtTime = socialStats.filter(
            post => new Date(post.createdAt.toMillis()).getHours() === hour
          );
          return {
            time: `${hour}:00`,
            label: 'Hora',
            ...calculateMetrics(postsAtTime)
          };
        });

      case 'weekly':
        return Array.from({ length: 7 }, (_, day) => {
          const postsAtTime = socialStats.filter(
            post => new Date(post.createdAt.toMillis()).getDay() === day
          );
          const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
          return {
            time: days[day],
            label: 'Día',
            ...calculateMetrics(postsAtTime)
          };
        });

      case 'monthly':
        // Nombres de los meses del año
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return Array.from({ length: 12 }, (_, month) => {
          const postsAtTime = socialStats.filter(
            post => new Date(post.createdAt.toMillis()).getMonth() === month
          );
          return {
            time: months[month],
            label: 'Mes',
            ...calculateMetrics(postsAtTime)
          };
        });

      default:
        return [];
    }
  };

  const calculateMetrics = (posts) => ({
    avgEngagement: posts.length ? 
      parseFloat((posts.reduce((acc, post) => 
        acc + ((post.likes + post.comments + post.shares) / post.reach) * 100
      , 0) / posts.length).toFixed(2)) : 0,
    postCount: posts.length
  });

  const data = getTimeData();
  console.log("🟢 DATA:", data);
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Typography variant="h6">Distribución Temporal de Posts</Typography>
        <FormControl size="small">
          <Select
            value={timeScale}
            onChange={(e) => setTimeScale(e.target.value)}
          >
            <MenuItem value="daily">Por Hora</MenuItem>
            <MenuItem value="weekly">Por Día</MenuItem>
            <MenuItem value="monthly">Por Mes</MenuItem>
          </Select>
        </FormControl>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart 
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time"
            label={{ 
              value: data[0]?.label || '', 
              position: 'bottom',
              offset: 0
            }}
          />
          <YAxis 
            yAxisId="left"
            label={{ 
              value: 'Cantidad de Posts', 
              angle: -90, 
              position: 'insideLeft',
              offset: -10
            }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            label={{ 
              value: 'Engagement Promedio (%)', 
              angle: 90, 
              position: 'insideRight',
              offset: 10
            }}
          />
          <Tooltip 
            formatter={(value, name) => {
              if (name === "avgEngagement") return [`${value}%`, "Engagement Promedio"];
              if (name === "postCount") return [value, "Cantidad de Posts"];
              return [value, name];
            }}
            labelFormatter={(time) => `${data[0]?.label}: ${time}`}
          />
          <Legend 
            formatter={(value) => {
              if (value === "postCount") return "Cantidad de Posts";
              if (value === "avgEngagement") return "Engagement Promedio";
              return value;
            }}
          />
          <Bar 
            yAxisId="left" 
            name="postCount" 
            dataKey="postCount" 
            fill="#8884d8"
            radius={[4, 4, 0, 0]}
          />
          <Line 
            yAxisId="right" 
            name="avgEngagement" 
            type="monotone" 
            dataKey="avgEngagement" 
            stroke="#82ca9d"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </>
  );
};

export default TimePerformanceChart;
