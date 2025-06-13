import React, { PureComponent } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: 'Events',
    attende: 4000,
    absent: 2400,
    amt: 2400,
  },
  {
    name: 'Workshops',
    attende: 3000,
    absent: 1398,
    amt: 2210,
  },
  {
    name: 'Talks',
    attende: 2000,
    absent: 8,
    amt: 2290,
  },

];

const renderCustomizedLabel = (props) => {
  const { x, y, width, height, value } = props;
  const radius = 10;

  return (
    <g>
      <circle cx={x + width / 2} cy={y - radius} r={radius} fill="#8884d8" />
      <text x={x + width / 2} y={y - radius} fill="#fff" textAnchor="middle" dominantBaseline="middle">
        {value.split(' ')[1]}
      </text>
    </g>
  );
};

export default class Attendace extends PureComponent {
  static demoUrl = 'https://codesandbox.io/p/sandbox/bar-chart-with-min-height-9nmfg9';

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="absent" fill="#EF4444" minPointSize={5}>
            <LabelList dataKey="name" content={renderCustomizedLabel} />
          </Bar>
          <Bar dataKey="attende" fill="#1d4ed8" minPointSize={10} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
