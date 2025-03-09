import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts"; // Añadido Tooltip

const PlatformComparisonChart = ({ socialStats }) => {
  if (!socialStats) return null;
  
  const platformMetrics = socialStats.reduce((acc, post) => {
    if (!acc[post.platform]) {
      acc[post.platform] = {
        totalPosts: 0,
        totalEngagement: 0,
        totalReach: 0,
        totalImpressions: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
      };
    }

    acc[post.platform].totalPosts++;
    acc[post.platform].totalEngagement +=
      ((post.likes + post.comments + post.shares) / post.reach) * 100;
    acc[post.platform].totalReach += post.reach;
    acc[post.platform].totalImpressions += post.impressions;
    acc[post.platform].totalLikes += post.likes;
    acc[post.platform].totalComments += post.comments;
    acc[post.platform].totalShares += post.shares;

    return acc;
  }, {});

  const data = Object.entries(platformMetrics).map(([platform, metrics]) => ({
    platform,
    engagementRate: parseFloat((metrics.totalEngagement / metrics.totalPosts).toFixed(2)),
    reachRate: parseFloat(((metrics.totalReach / metrics.totalImpressions) * 100).toFixed(2)),
    interactionRate: parseFloat((((metrics.totalLikes + metrics.totalComments + metrics.totalShares) / metrics.totalImpressions) * 100).toFixed(2)),
    shareRate: parseFloat(((metrics.totalShares / metrics.totalReach) * 100).toFixed(2)),
    postCount: metrics.totalPosts,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart 
        data={data}
        margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
      >
        <PolarGrid gridType="polygon" />
        <PolarAngleAxis 
          dataKey="platform" 
          tick={{ fill: '#666', fontSize: 14 }}
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 'auto']}
          tick={{ fill: '#666' }}
        />
        <Tooltip 
          formatter={(value, name) => {
            const labels = {
              engagementRate: 'Tasa de Engagement',
              reachRate: 'Tasa de Alcance',
              interactionRate: 'Tasa de Interacción',
              shareRate: 'Tasa de Compartidos'
            };
            return [`${value.toFixed(2)}%`, labels[name] || name];
          }}
          labelFormatter={(label) => `Plataforma: ${label}`}
        />
        <Legend 
          formatter={(value) => {
            const labels = {
              engagementRate: 'Tasa de Engagement',
              reachRate: 'Tasa de Alcance',
              interactionRate: 'Tasa de Interacción',
              shareRate: 'Tasa de Compartidos'
            };
            return labels[value] || value;
          }}
        />
        <Radar
          name="engagementRate"
          dataKey="engagementRate"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
        <Radar
          name="reachRate"
          dataKey="reachRate"
          stroke="#82ca9d"
          fill="#82ca9d"
          fillOpacity={0.6}
        />
        <Radar
          name="interactionRate"
          dataKey="interactionRate"
          stroke="#ffc658"
          fill="#ffc658"
          fillOpacity={0.6}
        />
        <Radar
          name="shareRate"
          dataKey="shareRate"
          stroke="#ff8042"
          fill="#ff8042"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default PlatformComparisonChart;