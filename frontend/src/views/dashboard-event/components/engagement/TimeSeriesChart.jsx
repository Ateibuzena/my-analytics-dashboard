import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TimeSeriesChart = ({ socialStats }) => {
  if (!socialStats) return null;
  
  const data = socialStats.map((post) => ({
    date: new Date(post.timestamp),
    engagement: ((post.likes + post.comments + post.shares) / post.reach) * 100,
    })).sort((a, b) => a.date - b.date);
  
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="engagement" stroke="#8884d8" />
          <Line type="monotone" dataKey="reach" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
  );
};
export default TimeSeriesChart;
