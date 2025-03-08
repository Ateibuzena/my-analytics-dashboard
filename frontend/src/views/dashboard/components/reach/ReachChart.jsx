import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const ReachChart = ({ socialStats }) => {
  const parseDate = (dateValue) => {
    if (dateValue instanceof Date) return dateValue;
    if (typeof dateValue === 'number') return new Date(dateValue);
    if (typeof dateValue === 'object' && dateValue?.seconds) {
      return new Date(dateValue.seconds * 1000);
    }
    return new Date(dateValue);
  };

  // Ordenar los posts y obtener fechas límite
  const sortedData = [...socialStats]
    .sort((a, b) => parseDate(a.createdAt) - parseDate(b.createdAt))
    .map(post => ({
      date: parseDate(post.createdAt),
      reach: post.reach
    }));

  // Si no hay datos, mostrar un rango predeterminado
  if (sortedData.length === 0) {
    const today = new Date();
    sortedData.push(
      { date: new Date(today.setMonth(today.getMonth() - 1)), reach: 0 },
      { date: new Date(today.setMonth(today.getMonth() + 2)), reach: 0 }
    );
  }

  // Obtener el primer y último día
  const firstDate = new Date(sortedData[0].date);
  const lastDate = new Date(sortedData[sortedData.length - 1].date);

  // Añadir un mes antes y después
  firstDate.setMonth(firstDate.getMonth() - 1);
  lastDate.setMonth(lastDate.getMonth() + 1);

  // Crear array con todos los días en el rango
  const allDates = [];
  const currentDate = new Date(firstDate);
  
  while (currentDate <= lastDate) {
    const existingData = sortedData.find(
      d => d.date.toDateString() === currentDate.toDateString()
    );
    
    allDates.push({
      date: new Date(currentDate),
      reach: existingData ? existingData.reach : null
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const formattedData = allDates.map(item => ({
    date: item.date.toLocaleDateString(),
    reach: item.reach
  }));

  // Calcular el mínimo y máximo de alcance (excluyendo valores null)
  const reaches = formattedData
    .map(item => item.reach)
    .filter(reach => reach !== null);
  
  const minReach = Math.min(...reaches);
  const maxReach = Math.max(...reaches);
  
  // Calcular el rango y los márgenes (10% del rango)
  const range = maxReach - minReach;
  const margin = range * 0.1;

  // Definir los límites del dominio
  const yDomain = [
    Math.max(0, minReach - margin), // No permitir valores negativos
    maxReach + margin
  ];

  return (
    <Grid item xs={12} md={6} mt={6.5}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Evolución del Alcance
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={formattedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                tickFormatter={(date) => date}
                interval={Math.floor(formattedData.length / 6)}
              />
              <YAxis 
                domain={yDomain}
                allowDataOverflow={false}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="reach"
                stroke="#8884d8"
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
                connectNulls={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ReachChart;