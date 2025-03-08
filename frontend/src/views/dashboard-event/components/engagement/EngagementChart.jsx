const EngagementChart = ({ socialStats }) => {
    const data = socialStats.map(post => ({
      name: post.postName,
      engagementRate: ((post.likes + post.comments + post.shares) / post.reach * 100).toFixed(2),
      likes: post.likes,
      comments: post.comments,
      shares: post.shares
    }));
  
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: 'Engagement Rate (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="engagementRate" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  };