const InteractionsChart = ({ socialStats }) => {
    const data = socialStats.map(post => ({
      name: post.postName,
      likes: post.likes,
      comments: post.comments,
      shares: post.shares
    }));
  
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="likes" fill="#8884d8" stackId="a" />
          <Bar dataKey="comments" fill="#82ca9d" stackId="a" />
          <Bar dataKey="shares" fill="#ffc658" stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    );
  };