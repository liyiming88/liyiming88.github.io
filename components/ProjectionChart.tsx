import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { UserProfile, ChartDataPoint } from '../types';
import { THEME_COLOR } from '../constants';

interface ProjectionChartProps {
  user: UserProfile;
}

const ProjectionChart: React.FC<ProjectionChartProps> = ({ user }) => {
  const data = useMemo(() => {
    const points: ChartDataPoint[] = [];
    let currentBalance = user.currentSavings;
    const yearsToProject = user.retirementAge - user.age + 20; // Project 20 years past retirement
    const annualContribution = user.monthlyContribution * 12;

    // Simplified growth assumptions
    const rates = {
      Conservative: 0.04,
      Moderate: 0.07,
      Aggressive: 0.10
    };

    let conservativeBalance = currentBalance;
    let moderateBalance = currentBalance;
    let aggressiveBalance = currentBalance;

    for (let i = 0; i <= yearsToProject; i++) {
      const year = new Date().getFullYear() + i;
      const age = user.age + i;
      
      points.push({
        year,
        age,
        conservative: Math.round(conservativeBalance),
        moderate: Math.round(moderateBalance),
        aggressive: Math.round(aggressiveBalance),
        target: i === (user.retirementAge - user.age) ? 2000000 : 0 // Simplified target marker
      });

      // Compound interest + contributions (stop contributions after retirement)
      if (age < user.retirementAge) {
        conservativeBalance = (conservativeBalance + annualContribution) * (1 + rates.Conservative);
        moderateBalance = (moderateBalance + annualContribution) * (1 + rates.Moderate);
        aggressiveBalance = (aggressiveBalance + annualContribution) * (1 + rates.Aggressive);
      } else {
        // Drawdown phase (simplified 4% withdrawal)
        conservativeBalance = conservativeBalance * (1 + rates.Conservative - 0.04);
        moderateBalance = moderateBalance * (1 + rates.Moderate - 0.04);
        aggressiveBalance = aggressiveBalance * (1 + rates.Aggressive - 0.04);
      }
    }
    return points;
  }, [user]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-[450px] w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Wealth Projection Analysis</h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorModerate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={THEME_COLOR} stopOpacity={0.2}/>
              <stop offset="95%" stopColor={THEME_COLOR} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="year" 
            tick={{fill: '#6b7280', fontSize: 12}} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            tick={{fill: '#6b7280', fontSize: 12}}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Balance']}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
          />
          <Legend wrapperStyle={{paddingTop: '20px'}}/>
          
          <Area 
            type="monotone" 
            dataKey="moderate" 
            name="Projected (Moderate)" 
            stroke={THEME_COLOR} 
            fillOpacity={1} 
            fill="url(#colorModerate)" 
            strokeWidth={3}
          />
          <Line 
            type="monotone" 
            dataKey="conservative" 
            name="Conservative" 
            stroke="#9ca3ae" 
            strokeDasharray="5 5" 
            dot={false}
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="aggressive" 
            name="Aggressive" 
            stroke="#10b981" 
            strokeDasharray="3 3" 
            dot={false}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectionChart;