import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

const ResumeScoreChart = ({ scores }: { scores: { category: string; score: number }[] }) => {
  return (
    <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto', height: 300 }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}></h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={scores}
          margin={{ top: 20, right: 50, left: 80, bottom: 20 }}
        >
          <XAxis type="number" domain={[0, 10]} />
          <YAxis dataKey="category" type="category" />
          <Tooltip />
          <Bar dataKey="score" fill="#6c757d" radius={[0, 6, 6, 0]}>
            <LabelList dataKey="score" position="right" formatter={(value) => `${value}/10`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResumeScoreChart;
