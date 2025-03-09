// ContentPerformanceChart.jsx
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ContentPerformanceChart = ({ socialStats }) => {
  if (!socialStats) return null;
  
  const contentAnalysis = socialStats.reduce((acc, post) => {
    const hasImage = post.mediaType?.includes("image");
    const hasVideo = post.mediaType?.includes("video");
    const hasLink = post.link ? true : false;

    const type = hasVideo
      ? "Video"
      : hasImage
      ? "Imagen"
      : hasLink
      ? "Link"
      : "Texto";

    if (!acc[type]) {
      acc[type] = {
        count: 0,
        totalEngagement: 0,
        avgReach: 0,
      };
    }

    acc[type].count++;
    acc[type].totalEngagement +=
      ((post.likes + post.comments + post.shares) / post.reach) * 100;
    acc[type].avgReach += post.reach;

    return acc;
  }, {});

  const data = Object.entries(contentAnalysis).map(([type, stats]) => ({
    type,
    avgEngagement: stats.totalEngagement / stats.count,
    avgReach: stats.avgReach / stats.count,
    count: stats.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="type" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="avgEngagement"
          fill="#8884d8"
          name="Engagement Promedio"
        />
        <Bar dataKey="count" fill="#82ca9d" name="Cantidad de Posts" />
      </BarChart>
    </ResponsiveContainer>
  );
};
export default ContentPerformanceChart;
