import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from 'recharts';
import {
  buildStatusPieData,
  buildMonthlyGrowth,
  buildWeeklyEnquiries,
  CHART_PRIMARY,
  CHART_ACCENT,
} from '../../utils/chartData';

const tooltipStyle = {
  fontSize: 12,
  borderRadius: 8,
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.1)',
  color: '#1e293b',
};

const axisTick = { fontSize: 11, fill: '#64748b' };

function ChartCard({ title, subtitle, chart, footer }) {
  return (
    <div className="card-elevated flex flex-col p-4 sm:p-5">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className="h-48 w-full sm:h-52">{chart}</div>
      {footer}
    </div>
  );
}

export default function DashboardCharts({ stats, leads }) {
  const pieData = buildStatusPieData(stats);
  const monthlyData = buildMonthlyGrowth(leads);
  const weeklyData = buildWeeklyEnquiries(leads);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <ChartCard
        title="Lead Status Distribution"
        subtitle="Current pipeline breakdown"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={74}
                paddingAngle={3}
                dataKey="value"
                stroke="#fff"
                strokeWidth={2}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [value, name]} />
            </PieChart>
          </ResponsiveContainer>
        }
        footer={
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name} ({item.value})
              </div>
            ))}
          </div>
        }
      />

      <ChartCard
        title="Monthly Lead Growth"
        subtitle="Leads by month"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barFill" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#6D28D9" />
                  <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="leads" fill="url(#barFill)" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        }
      />

      <ChartCard
        title="Weekly Enquiries"
        subtitle="Leads by weekday"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="day" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="enquiries"
                stroke={CHART_ACCENT}
                strokeWidth={2.5}
                dot={{ r: 4, fill: CHART_ACCENT, stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: CHART_PRIMARY, stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        }
      />
    </div>
  );
}
