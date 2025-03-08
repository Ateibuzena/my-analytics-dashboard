import { 
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const PlatformStats = ({ socialStats }) => {
    const platformData = socialStats.reduce((acc, post) => {
      if (!acc[post.platform]) {
        acc[post.platform] = {
          likes: 0,
          comments: 0,
          shares: 0,
          reach: 0,
          impressions: 0,
          posts: 0
        };
      }
      acc[post.platform].likes += post.likes;
      acc[post.platform].comments += post.comments;
      acc[post.platform].shares += post.shares;
      acc[post.platform].reach += post.reach;
      acc[post.platform].impressions += post.impressions;
      acc[post.platform].posts += 1;
      return acc;
    }, {});
  
    const data = Object.entries(platformData).map(([platform, stats]) => ({
      platform,
      ...stats,
      // Calculamos promedios para métricas más significativas
      avgReach: Math.round(stats.reach / stats.posts),
      avgImpressions: Math.round(stats.impressions / stats.posts),
      engagement: Math.round((stats.likes + stats.comments + stats.shares) / stats.reach * 100)
    }));

    return (
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Estadísticas por Plataforma
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                <PolarGrid gridType="polygon" />
                <PolarAngleAxis
                  dataKey="platform"
                  tick={{ fill: '#333', fontSize: 14 }} // Color más oscuro para las etiquetas
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 'auto']}
                  tick={{ fill: '#333' }} // Color más oscuro para los números del eje
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#333', // Texto más oscuro en el tooltip
                    border: '1px solid #ccc'
                  }}
                  formatter={(value, name) => [
                    value.toLocaleString(),
                    name.charAt(0).toUpperCase() + name.slice(1)
                  ]}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                  style={{ color: '#333' }} // Texto más oscuro en la leyenda
                />
                <Radar
                  name="Alcance Promedio"
                  dataKey="avgReach"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.5}
                  dot={{ fill: '#8884d8', r: 4 }}
                  activeDot={{ r: 8 }}
                />
                <Radar
                  name="Impresiones Promedio"
                  dataKey="avgImpressions"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.5}
                  dot={{ fill: '#82ca9d', r: 4 }}
                  activeDot={{ r: 8 }}
                />
                <Radar
                  name="Engagement (%)"
                  dataKey="engagement"
                  stroke="#ffc658"
                  fill="#ffc658"
                  fillOpacity={0.5}
                  dot={{ fill: '#ffc658', r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    );
};

export default PlatformStats;