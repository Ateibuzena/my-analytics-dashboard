import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
  } from "recharts";

import { Card, CardContent, Typography, Grid } from "@mui/material";
const ImpressionsChart = ({ socialStats }) => {
    

    const platformStats = socialStats.reduce((acc, post) => {
        acc[post.platform] = (acc[post.platform] || 0) + post.impressions;
        return acc;
      }, {});
  
    
    return (
    <Grid item xs={12} md={6}  mt={6.5}>
      <Card >
        <CardContent >
          <Typography variant="h6" gutterBottom>
            Impresiones por Plataforma
          </Typography>
          <BarChart
            margin={{ top: 20,  }}
            width={400}
            height={300}
            data={Object.entries(platformStats).map(
              ([platform, impressions]) => ({
                platform,
                impressions,
              })
            )}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="platform" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="impressions" fill="#8884d8" />
          </BarChart>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ImpressionsChart;
