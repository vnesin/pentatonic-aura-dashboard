import { useMemo, useState } from 'react';
import { Moon, Sun } from '@solar-icons/react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Logo,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@pentatonic-ltd/ui';
import { data, type DashboardTab } from '../data';

// --- Types ---

type Legislation = 'sb707' | 'eu-epr' | 'csrd';
type Region = 'california' | 'new-york' | 'texas' | 'florida' | 'illinois' | 'eu';
type ChecklistStatus = 'met' | 'in_progress' | 'required' | 'advisory';

type ChecklistItem = { item: string; status: ChecklistStatus; note: string };
type LegislationConfig = {
  title: string;
  target: number;
  targetLabel: string;
  checklist: ChecklistItem[];
};

// --- Constants ---

const POPULATION_MULTIPLIERS: Record<Region, number> = {
  california: 1.0,
  'new-york': 0.494,
  texas: 0.772,
  florida: 0.572,
  illinois: 0.319,
  eu: 11.39
};

const REGION_NAMES: Record<Region, string> = {
  california: 'California',
  'new-york': 'New York',
  texas: 'Texas',
  florida: 'Florida',
  illinois: 'Illinois',
  eu: 'European Union'
};

const SB707_REGIONS: Array<{ value: Region; label: string }> = [
  { value: 'california', label: 'California' },
  { value: 'new-york', label: 'New York' },
  { value: 'texas', label: 'Texas' },
  { value: 'florida', label: 'Florida' },
  { value: 'illinois', label: 'Illinois' }
];

const LEGISLATION_CONFIG: Record<Legislation, LegislationConfig> = {
  sb707: {
    title: 'SB 707 Checklist',
    target: 50,
    targetLabel: 'Reuse Rate vs SB 707 Target',
    checklist: data.compliance.checklist
  },
  'eu-epr': {
    title: 'EU Textile EPR Checklist',
    target: 55,
    targetLabel: 'Reuse Rate vs EU EPR',
    checklist: [
      { item: 'PRO Registration', status: 'met', note: 'Registered with national PRO' },
      { item: 'Collection Infrastructure', status: 'in_progress', note: 'Partnership with 3 collectors' },
      { item: 'Recycled Content Targets', status: 'in_progress', note: '12% achieved, 25% target' },
      { item: 'Eco-Modulation Fees', status: 'required', note: 'Design assessment pending' },
      { item: 'Annual Reporting', status: 'advisory', note: 'Template under review' }
    ]
  },
  csrd: {
    title: 'CSRD Compliance Checklist',
    target: 100,
    targetLabel: 'CSRD Readiness',
    checklist: [
      { item: 'Double Materiality Assessment', status: 'in_progress', note: 'Gap analysis complete' },
      { item: 'Sustainability Statement', status: 'required', note: 'ESRS mapping in progress' },
      { item: 'Third-Party Assurance', status: 'required', note: 'Auditor selection underway' },
      { item: 'Digital Tagging (DPP)', status: 'advisory', note: 'Pilot planned Q3 2026' },
      { item: 'Board-Level Oversight', status: 'met', note: 'Sustainability committee active' }
    ]
  }
};

const statusStyles: Record<ChecklistStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'default' }> = {
  met: { label: 'Met', variant: 'success' },
  in_progress: { label: 'In Progress', variant: 'warning' },
  required: { label: 'Required', variant: 'error' },
  advisory: { label: 'Advisory', variant: 'default' }
};

// --- Helpers ---

function computeChecklistReadiness(checklist: ChecklistItem[]): number {
  const weights: Record<ChecklistStatus, number | null> = { met: 1, in_progress: 0.5, required: 0, advisory: null };
  const scored = checklist.filter((item) => weights[item.status] !== null);
  if (scored.length === 0) return 0;
  const total = scored.reduce((sum, item) => sum + (weights[item.status] as number), 0);
  return Math.round((total / scored.length) * 100);
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function abbreviateNumber(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${Math.round(v / 1_000)}k`;
  return String(v);
}

function getChartStyles(isDark: boolean) {
  const axisColor = isDark ? '#FFFFFF' : '#171717';
  const gridColor = isDark ? '#2a2a2a' : '#F0F0F0';
  const cursorFill = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  return {
    axis: { stroke: axisColor, tickMargin: 10, tick: { fill: axisColor, fontSize: 11, fontFamily: 'Atkinson Hyperlegible Mono', fontWeight: 200, style: { textTransform: 'uppercase' as const } } },
    axisSmall: { stroke: axisColor, tickMargin: 10, tick: { fill: axisColor, fontSize: 10, fontFamily: 'Atkinson Hyperlegible Mono', fontWeight: 200, style: { textTransform: 'uppercase' as const } } },
    grid: { stroke: gridColor },
    cursor: { fill: cursorFill },
    tooltip: {
      contentStyle: {
        borderRadius: 0,
        border: `1px solid #A9A9A9`,
        background: isDark ? '#171717' : '#FFFFFF',
        boxShadow: 'none',
        padding: '8px 12px'
      },
      labelStyle: {
        fontFamily: 'Atkinson Hyperlegible Mono',
        fontSize: 11,
        fontWeight: 200,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.1em',
        color: '#A9A9A9',
        marginBottom: 4
      },
      itemStyle: {
        fontFamily: 'Atkinson Hyperlegible Next',
        fontSize: 14,
        fontWeight: 300,
        color: isDark ? '#FFFFFF' : '#171717'
      }
    },
    monoFill: isDark ? '#FFFFFF' : '#171717'
  };
}

// --- Shared styles ---

const metaLabel = 'font-mono font-extralight text-[14px] uppercase tracking-wide text-[#A9A9A9]';

// --- Tab components ---

type ScaledTrends = Array<{ month: string; listings: number; gmv: number; avgPrice: number }>;
type ScaledPlatforms = Array<{ name: string; volume: number; avgPrice: number; premium: boolean }>;
type ScaledFeeExposure = Array<{ complianceLevel: string; estimatedFee: number; savingsVsNonCompliance: number }>;

function OverviewTab({
  listings,
  gmv,
  targetLabel,
  targetPct,
  trends,
  isDark,
  readinessPct
}: {
  listings: number;
  gmv: number;
  targetLabel: string;
  targetPct: number;
  trends: ScaledTrends;
  isDark: boolean;
  readinessPct?: number;
}) {
  const chart = getChartStyles(isDark);
  const fourthKpi = readinessPct !== undefined
    ? { label: targetLabel, value: `${readinessPct}%`, subValue: 'of requirements met', ariaLabel: `${readinessPct}% of requirements met` }
    : { label: targetLabel, value: `${data.brand.reuseRatePct}%`, subValue: `of ${targetPct}% target`, ariaLabel: `${data.brand.reuseRatePct}% of ${targetPct}% target` };

  const kpis = [
    { label: 'Units in Secondary Market', value: listings.toLocaleString(), ariaLabel: undefined },
    { label: 'Resale GMV', value: formatCurrency(gmv), ariaLabel: undefined },
    { label: 'Average Price Retention', value: `${data.brand.avgPriceRetentionPct}%`, ariaLabel: undefined },
    fourthKpi
  ];

  return (
    <div className="flex flex-col gap-6 pb-40">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} variant="outlined" padding="sm">
            <CardContent>
              <p className={metaLabel}>{kpi.label}</p>
              <p
                className="mt-2 font-body font-thin text-[47px] lg:text-[59px] leading-[1.1] text-[#171717] dark:text-white"
                aria-label={kpi.ariaLabel}
              >
                {kpi.value}
              </p>
              {'subValue' in kpi && kpi.subValue && (
                <p className={`mt-1 ${metaLabel}`}>{kpi.subValue}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </section>

      <Card variant="outlined" padding="sm">
        <CardHeader>
          <CardTitle>Monthly Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid {...chart.grid} strokeDasharray="0" />
                <XAxis dataKey="month" {...chart.axis} />
                <YAxis yAxisId="left" {...chart.axis} tickFormatter={abbreviateNumber} />
                <YAxis yAxisId="right" orientation="right" {...chart.axis} />
                <Tooltip cursor={chart.cursor} {...chart.tooltip} />
                <Legend
                  align="left"
                  content={({ payload }) => (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px', marginBottom: '8px' }}>
                      {payload?.map((entry) => (
                        <div key={entry.value} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <div style={{ width: 8, height: 8, backgroundColor: entry.color, flexShrink: 0 }} />
                          <span style={{ fontFamily: 'Atkinson Hyperlegible Mono', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em', color: chart.axis.tick.fill }}>
                            {entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                />
                <Line yAxisId="left" type="monotone" dataKey="listings" name="Listings" stroke="#3941EB" strokeWidth={2} dot={false} />
                <Line yAxisId="left" type="monotone" dataKey="gmv" name="GMV" stroke="#FF4C00" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="avgPrice" name="Avg Price" stroke="#5BC48B" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card variant="outlined" padding="sm">
        <CardHeader>
          <CardTitle>Category Price Retention</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.categoryRetention} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" {...chart.axis} />
                <YAxis type="category" dataKey="category" {...chart.axis} width={100} />
                <Tooltip cursor={chart.cursor} formatter={(value) => [`${value}%`, 'Retention']} {...chart.tooltip} />
                <Bar dataKey="retentionPct" fill={chart.monoFill} radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PlatformsTab({ platforms, isDark }: { platforms: ScaledPlatforms; isDark: boolean }) {
  const chart = getChartStyles(isDark);
  const premiumChannels = useMemo(() => platforms.filter((p) => p.premium), [platforms]);

  return (
    <div className="flex flex-col gap-6 pb-40">
      <Card variant="outlined" padding="sm">
        <CardHeader>
          <CardTitle>Listings by Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platforms}>
                <XAxis dataKey="name" {...chart.axisSmall} />
                <YAxis {...chart.axis} />
                <Tooltip cursor={chart.cursor} formatter={(value) => [Number(value).toLocaleString(), 'Listings']} {...chart.tooltip} />
                <Bar dataKey="volume" fill={chart.monoFill} radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card variant="outlined" padding="sm">
        <CardHeader>
          <CardTitle>Average Resale Price by Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platforms}>
                <XAxis dataKey="name" {...chart.axisSmall} />
                <YAxis {...chart.axis} />
                <Tooltip cursor={chart.cursor} formatter={(value) => [formatCurrency(Number(value)), 'Average Price']} {...chart.tooltip} />
                <Bar dataKey="avgPrice" fill={chart.monoFill} radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <h2 className="font-body font-light text-[23px] lg:text-[29px] leading-[1.1] text-[#171717] dark:text-white">Premium Channels</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {premiumChannels.map((channel) => (
            <Card key={channel.name} variant="outlined" padding="sm">
              <CardContent>
                <p className="font-body font-light text-[23px] leading-[1.1] text-[#171717] dark:text-white">
                  {channel.name}
                </p>
                <p className={`mt-2 ${metaLabel}`}>
                  {channel.volume.toLocaleString()} listings · {formatCurrency(channel.avgPrice)} avg
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComplianceTab({
  legislationTitle,
  checklist,
  targetPct,
  feeExposure
}: {
  legislationTitle: string;
  checklist: ChecklistItem[];
  targetPct: number;
  feeExposure: ScaledFeeExposure;
}) {
  const progress = Math.min((data.brand.reuseRatePct / targetPct) * 100, 100);
  const progressVariant = data.brand.reuseRatePct >= targetPct ? 'success' : 'warning';

  return (
    <div className="flex flex-col gap-6 pb-40">
      <Card variant="outlined" padding="sm">
        <CardHeader>
          <CardTitle>{legislationTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Requirement</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checklist.map((item) => {
                  const style = statusStyles[item.status];
                  return (
                    <TableRow key={item.item}>
                      <TableCell>{item.item}</TableCell>
                      <TableCell><Badge variant={style.variant}>{style.label}</Badge></TableCell>
                      <TableCell>{item.note}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card variant="outlined" padding="sm">
        <CardHeader>
          <CardTitle>Reuse Rate Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <p className="font-body font-thin text-[47px] lg:text-[59px] leading-[1.1] text-[#171717] dark:text-white">
                {data.brand.reuseRatePct}%
              </p>
              <p className={metaLabel}>Target {targetPct}%</p>
            </div>
            <Progress value={progress} variant={progressVariant} />
          </div>
        </CardContent>
      </Card>

      <Card variant="outlined" padding="sm">
        <CardHeader>
          <CardTitle>Fee Exposure Model</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Compliance Level</TableHead>
                  <TableHead>Estimated Fee</TableHead>
                  <TableHead>Savings vs Non-Compliance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeExposure.map((row) => (
                  <TableRow key={row.complianceLevel}>
                    <TableCell>{row.complianceLevel}</TableCell>
                    <TableCell>{formatCurrency(row.estimatedFee)}</TableCell>
                    <TableCell>{formatCurrency(row.savingsVsNonCompliance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [legislation, setLegislation] = useState<Legislation>('sb707');
  const [region, setRegion] = useState<Region>('california');
  const [isDark, setIsDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);

  const regionOptions = legislation === 'sb707' ? SB707_REGIONS : [{ value: 'eu' as Region, label: 'European Union' }];
  const regionLocked = regionOptions.length === 1;
  const legislationConfig = LEGISLATION_CONFIG[legislation];
  const multiplier = POPULATION_MULTIPLIERS[region];

  const handleLegislationChange = (newLeg: Legislation) => {
    setLegislation(newLeg);
    setRegion(newLeg === 'sb707' ? 'california' : 'eu');
  };

  const csrdReadiness = useMemo(
    () => legislation === 'csrd' ? computeChecklistReadiness(LEGISLATION_CONFIG.csrd.checklist) : undefined,
    [legislation]
  );

  const scaledData = useMemo(
    () => ({
      listings: Math.round(data.brand.listings * multiplier),
      gmv: Math.round(data.brand.resaleGmv * multiplier),
      trends: data.trends.map((t) => ({
        ...t,
        listings: Math.round(t.listings * multiplier),
        gmv: Math.round(t.gmv * multiplier)
      })),
      platforms: data.platforms.map((p) => ({
        ...p,
        volume: Math.round(p.volume * multiplier)
      })),
      feeExposure: data.compliance.feeExposure.map((f) => ({
        ...f,
        estimatedFee: Math.round(f.estimatedFee * multiplier),
        savingsVsNonCompliance: Math.round(f.savingsVsNonCompliance * multiplier)
      }))
    }),
    [multiplier]
  );

  return (
    <div className={`min-h-screen bg-pentatonic-white text-pentatonic-black dark:bg-[#0F0F0F] dark:text-pentatonic-white${isDark ? ' dark' : ''}`}>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DashboardTab)}>
        <header className="dark bg-pentatonic-black px-6 py-8 md:px-10">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-6">
            <div className="flex w-full items-center justify-between">
              <Logo size="lg" variant="light" />
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsDark((d) => !d)}
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? <Moon weight="LineDuotone" size={18} /> : <Sun weight="LineDuotone" size={18} />}
                </Button>
                <Button variant="secondary" onClick={() => window.print()}>Export PDF Report</Button>
              </div>
            </div>
            <div className="space-y-2 w-full min-w-0 overflow-hidden">
              <p className="font-mono font-extralight text-[14px] uppercase tracking-wide text-pentatonic-grayMedium">
                SECONDHAND INTELLIGENCE DASHBOARD
              </p>
              <h1 className="font-body text-[59px] lg:text-[76px] font-light leading-[1.1] text-pentatonic-white truncate">
                {data.brand.name} · {REGION_NAMES[region]}
              </h1>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex flex-col gap-1">
                <Label>Legislation</Label>
                <Select value={legislation} onValueChange={(v) => handleLegislationChange(v as Legislation)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent theme={isDark ? "dark" : "light"}>
                    <SelectItem value="sb707">California Textile EPR (SB 707)</SelectItem>
                    <SelectItem value="eu-epr">EU Textile EPR (Revised Waste Framework)</SelectItem>
                    <SelectItem value="csrd">CSRD (Corporate Sustainability Reporting)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <Label>Region</Label>
                <Select value={region} onValueChange={(v) => setRegion(v as Region)} disabled={regionLocked}>
                  <SelectTrigger aria-label={regionLocked ? 'Region fixed by legislation' : 'Select region'}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent theme={isDark ? "dark" : "light"}>
                    {regionOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>
          </div>
        </header>

        <main className="px-6 py-8 md:px-10">
          <div className="mx-auto w-full max-w-7xl">
            <TabsContent value="overview">
              <OverviewTab
                listings={scaledData.listings}
                gmv={scaledData.gmv}
                targetLabel={legislationConfig.targetLabel}
                targetPct={legislationConfig.target}
                trends={scaledData.trends}
                isDark={isDark}
                readinessPct={csrdReadiness}
              />
            </TabsContent>
            <TabsContent value="platforms">
              <PlatformsTab platforms={scaledData.platforms} isDark={isDark} />
            </TabsContent>
            <TabsContent value="compliance">
              <ComplianceTab
                legislationTitle={legislationConfig.title}
                checklist={legislationConfig.checklist}
                targetPct={legislationConfig.target}
                feeExposure={scaledData.feeExposure}
              />
            </TabsContent>
          </div>
        </main>
      </Tabs>

      <aside className="fixed bottom-0 left-0 right-0 border-t border-pentatonic-grayMedium/40 dark:border-pentatonic-grayMedium/20 bg-pentatonic-grayLight/80 dark:bg-pentatonic-black/80 backdrop-blur-sm px-6 py-6 md:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="font-body font-light text-[23px] lg:text-[29px] leading-[1.1] text-[#171717] dark:text-white">AURA Insight</h2>
            <p className="max-w-4xl font-body font-light text-[14px] md:text-[18px] leading-[1.6] text-[#171717] dark:text-white">
              {data.insights[activeTab]}
            </p>
          </div>
          <div className="w-full md:w-auto md:shrink-0">
            <Button variant="primary" title="Generate a prioritised action plan based on the current insight">Prioritise Action</Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
