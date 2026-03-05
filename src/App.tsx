import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { data, type DashboardTab } from '../data';

const tabs: Array<{ id: DashboardTab; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'platforms', label: 'Platforms' },
  { id: 'compliance', label: 'Compliance' }
];

const statusStyles: Record<string, { label: string; color: string }> = {
  met: { label: 'MET', color: '#00FBA9' },
  in_progress: { label: 'IN PROGRESS', color: '#3941EB' },
  required: { label: 'REQUIRED', color: '#FF4C00' },
  advisory: { label: 'ADVISORY', color: '#A9A9A9' }
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

function OverviewTab() {
  const kpis = [
    { label: 'Units In Secondary Market', value: data.brand.listings.toLocaleString() },
    { label: 'Resale GMV', value: formatCurrency(data.brand.resaleGmv) },
    { label: 'Average Price Retention', value: `${data.brand.avgPriceRetentionPct}%` },
    {
      label: 'Reuse Rate vs SB 707 Target',
      value: `${data.brand.reuseRatePct}% / ${data.brand.sb707TargetPct}%`
    }
  ];

  return (
    <div className="flex flex-col gap-6 pb-28">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <article key={kpi.label} className="border border-pentatonic-black bg-pentatonic-grayLight p-4">
            <p className="font-mono text-xs uppercase tracking-widest text-pentatonic-grayMedium">{kpi.label}</p>
            <p className="mt-2 font-body text-4xl font-thin text-pentatonic-black">{kpi.value}</p>
          </article>
        ))}
      </section>

      <section className="border border-pentatonic-black bg-pentatonic-grayLight p-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-pentatonic-grayMedium">8-Month Trend</h2>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.trends}>
              <CartesianGrid stroke="#E8E8E8" strokeDasharray="0" />
              <XAxis dataKey="month" stroke="#171717" tick={{ fill: '#171717', fontSize: 12 }} />
              <YAxis yAxisId="left" stroke="#171717" tick={{ fill: '#171717', fontSize: 12 }} />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#171717"
                tick={{ fill: '#171717', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{ borderRadius: 0, border: '1px solid #171717', background: '#FFFFFF' }}
              />
              <Legend wrapperStyle={{ fontFamily: 'Atkinson Hyperlegible Mono', fontSize: 11 }} />
              <Line yAxisId="left" type="monotone" dataKey="listings" stroke="#5BC48B" strokeWidth={2} />
              <Line yAxisId="left" type="monotone" dataKey="gmv" stroke="#3941EB" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="avgPrice" stroke="#FFB788" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="border border-pentatonic-black bg-pentatonic-grayLight p-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-pentatonic-grayMedium">
          Category Price Retention
        </h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.categoryRetention} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid stroke="#E8E8E8" />
              <XAxis type="number" stroke="#171717" tick={{ fill: '#171717', fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="category"
                stroke="#171717"
                tick={{ fill: '#171717', fontSize: 12 }}
                width={100}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Retention']}
                contentStyle={{ borderRadius: 0, border: '1px solid #171717', background: '#FFFFFF' }}
              />
              <Bar dataKey="retentionPct" fill="#9EA8FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

function PlatformsTab() {
  const premiumChannels = useMemo(
    () => data.platforms.filter((platform) => platform.premium).map((platform) => platform.name),
    []
  );

  return (
    <div className="flex flex-col gap-6 pb-28">
      <section className="border border-pentatonic-black bg-pentatonic-grayLight p-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-pentatonic-grayMedium">
          Volume By Platform
        </h2>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.platforms}>
              <CartesianGrid stroke="#E8E8E8" />
              <XAxis dataKey="name" stroke="#171717" tick={{ fill: '#171717', fontSize: 11 }} />
              <YAxis stroke="#171717" tick={{ fill: '#171717', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: 0, border: '1px solid #171717', background: '#FFFFFF' }}
              />
              <Bar dataKey="volume" fill="#5BC48B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="border border-pentatonic-black bg-pentatonic-grayLight p-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-pentatonic-grayMedium">
          Average Resale Price By Platform
        </h2>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.platforms}>
              <CartesianGrid stroke="#E8E8E8" />
              <XAxis dataKey="name" stroke="#171717" tick={{ fill: '#171717', fontSize: 11 }} />
              <YAxis stroke="#171717" tick={{ fill: '#171717', fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [formatCurrency(Number(value)), 'Average Price']}
                contentStyle={{ borderRadius: 0, border: '1px solid #171717', background: '#FFFFFF' }}
              />
              <Bar dataKey="avgPrice">
                {data.platforms.map((entry) => (
                  <Cell key={entry.name} fill={entry.premium ? '#3941EB' : '#9EA8FF'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="border border-pentatonic-black bg-pentatonic-grayLight p-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-pentatonic-grayMedium">Premium Channels</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {premiumChannels.map((channel) => (
            <article key={channel} className="border border-pentatonic-black bg-pentatonic-white p-4">
              <p className="font-mono text-xs uppercase tracking-widest text-pentatonic-blue">Premium</p>
              <p className="mt-2 text-2xl font-thin">{channel}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ComplianceTab() {
  const progress = (data.brand.reuseRatePct / data.brand.sb707TargetPct) * 100;

  return (
    <div className="flex flex-col gap-6 pb-28">
      <section className="border border-pentatonic-black bg-pentatonic-grayLight p-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-pentatonic-grayMedium">
          SB 707 Checklist
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-pentatonic-black">
                <th className="py-2 pr-4 font-mono text-xs uppercase tracking-widest text-pentatonic-grayMedium">
                  Requirement
                </th>
                <th className="py-2 pr-4 font-mono text-xs uppercase tracking-widest text-pentatonic-grayMedium">
                  Status
                </th>
                <th className="py-2 font-mono text-xs uppercase tracking-widest text-pentatonic-grayMedium">Note</th>
              </tr>
            </thead>
            <tbody>
              {data.compliance.checklist.map((item) => {
                const style = statusStyles[item.status];
                return (
                  <tr key={item.item} className="border-b border-[#E0E0E0]">
                    <td className="py-3 pr-4">{item.item}</td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="inline-block h-3 w-3 border border-pentatonic-black"
                          style={{ backgroundColor: style.color }}
                        />
                        <span className="font-mono text-xs uppercase tracking-widest">{style.label}</span>
                      </span>
                    </td>
                    <td className="py-3">{item.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border border-pentatonic-black bg-pentatonic-grayLight p-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-pentatonic-grayMedium">
          Reuse Rate Progress
        </h2>
        <div className="mt-4 space-y-2">
          <div className="flex items-end justify-between">
            <p className="font-body text-4xl font-thin text-pentatonic-black">{data.brand.reuseRatePct}%</p>
            <p className="font-mono text-xs uppercase tracking-widest text-pentatonic-grayMedium">
              Target {data.brand.sb707TargetPct}%
            </p>
          </div>
          <div className="h-4 border border-pentatonic-black bg-pentatonic-white">
            <div className="h-full bg-pentatonic-mint" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
        </div>
      </section>

      <section className="border border-pentatonic-black bg-pentatonic-grayLight p-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-pentatonic-grayMedium">
          Fee Exposure Model
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-pentatonic-black">
                <th className="py-2 pr-4 font-mono text-xs uppercase tracking-widest text-pentatonic-grayMedium">
                  Compliance Level
                </th>
                <th className="py-2 pr-4 font-mono text-xs uppercase tracking-widest text-pentatonic-grayMedium">
                  Estimated Fee
                </th>
                <th className="py-2 font-mono text-xs uppercase tracking-widest text-pentatonic-grayMedium">
                  Savings Vs Non-Compliance
                </th>
              </tr>
            </thead>
            <tbody>
              {data.compliance.feeExposure.map((row) => (
                <tr key={row.complianceLevel} className="border-b border-[#E0E0E0]">
                  <td className="py-3 pr-4">{row.complianceLevel}</td>
                  <td className="py-3 pr-4">{formatCurrency(row.estimatedFee)}</td>
                  <td className="py-3" style={{ color: row.savingsVsNonCompliance > 0 ? '#00FBA9' : '#171717' }}>
                    {formatCurrency(row.savingsVsNonCompliance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  return (
    <div className="min-h-screen bg-pentatonic-white pb-24 text-pentatonic-black">
      <header className="bg-pentatonic-black px-6 py-8 md:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-6">
          <img src="https://pub-ab109a8a73bd4a89a0df2c903e8e86e7.r2.dev/pentatonic-logo.svg" alt="Pentatonic" className="h-8 w-auto" />
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-pentatonic-grayMedium">
              SECONDHAND INTELLIGENCE DASHBOARD
            </p>
            <h1 className="font-body text-4xl font-thin text-pentatonic-white">
              {data.brand.name} · {data.brand.location}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="rounded-full border border-pentatonic-white px-5 py-2 font-mono text-xs uppercase tracking-widest transition-colors"
                  style={{
                    backgroundColor: isActive ? '#00FBA9' : 'transparent',
                    color: isActive ? '#171717' : '#FFFFFF'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8 md:px-10">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'platforms' && <PlatformsTab />}
        {activeTab === 'compliance' && <ComplianceTab />}
      </main>

      <aside className="fixed bottom-0 left-0 right-0 border-t border-pentatonic-black bg-pentatonic-grayLight px-6 py-4 md:px-10">
        <div className="mx-auto flex w-full max-w-7xl items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-pentatonic-grayMedium">AI Insight</p>
            <p className="mt-1 max-w-4xl text-sm leading-6 text-pentatonic-black">{data.insights[activeTab]}</p>
          </div>
          <button type="button" className="rounded-full bg-pentatonic-mint px-4 py-2 font-mono text-xs uppercase tracking-widest text-pentatonic-black">
            Prioritize Action
          </button>
        </div>
      </aside>
    </div>
  );
}
