export type DashboardTab = 'overview' | 'platforms' | 'compliance';

export type DashboardData = {
  brand: {
    name: string;
    location: string;
    listings: number;
    resaleGmv: number;
    avgPriceRetentionPct: number;
    reuseRatePct: number;
    sb707TargetPct: number;
  };
  trends: Array<{
    month: string;
    listings: number;
    gmv: number;
    avgPrice: number;
  }>;
  categoryRetention: Array<{
    category: string;
    retentionPct: number;
  }>;
  platforms: Array<{
    name: string;
    volume: number;
    avgPrice: number;
    premium: boolean;
  }>;
  compliance: {
    checklist: Array<{
      item: string;
      status: 'met' | 'in_progress' | 'required' | 'advisory';
      note: string;
    }>;
    feeExposure: Array<{
      complianceLevel: string;
      estimatedFee: number;
      savingsVsNonCompliance: number;
    }>;
  };
  insights: Record<DashboardTab, string>;
};

export const data: DashboardData = {
  brand: {
    name: 'AURA',
    location: 'Los Angeles, CA',
    listings: 4236,
    resaleGmv: 892400,
    avgPriceRetentionPct: 41,
    reuseRatePct: 34,
    sb707TargetPct: 50
  },
  trends: [
    { month: 'Jul 2025', listings: 420, gmv: 84800, avgPrice: 196 },
    { month: 'Aug 2025', listings: 455, gmv: 89600, avgPrice: 197 },
    { month: 'Sep 2025', listings: 488, gmv: 94400, avgPrice: 198 },
    { month: 'Oct 2025', listings: 514, gmv: 101300, avgPrice: 201 },
    { month: 'Nov 2025', listings: 533, gmv: 107500, avgPrice: 204 },
    { month: 'Dec 2025', listings: 561, gmv: 114800, avgPrice: 207 },
    { month: 'Jan 2026', listings: 599, gmv: 122400, avgPrice: 208 },
    { month: 'Feb 2026', listings: 666, gmv: 127600, avgPrice: 211 }
  ],
  categoryRetention: [
    { category: 'Dresses', retentionPct: 47 },
    { category: 'Outerwear', retentionPct: 52 },
    { category: 'Tops', retentionPct: 34 },
    { category: 'Denim', retentionPct: 43 },
    { category: 'Accessories', retentionPct: 39 }
  ],
  platforms: [
    { name: 'Poshmark', volume: 980, avgPrice: 165, premium: false },
    { name: 'eBay', volume: 720, avgPrice: 159, premium: false },
    { name: 'Depop', volume: 640, avgPrice: 151, premium: false },
    { name: 'Mercari', volume: 490, avgPrice: 145, premium: false },
    { name: 'ThredUp', volume: 420, avgPrice: 132, premium: false },
    { name: 'Grailed', volume: 350, avgPrice: 204, premium: false },
    { name: 'StockX', volume: 246, avgPrice: 218, premium: true },
    { name: 'The RealReal', volume: 190, avgPrice: 264, premium: true },
    { name: 'Vestiaire Collective', volume: 200, avgPrice: 289, premium: true }
  ],
  compliance: {
    checklist: [
      { item: 'PRO Registration', status: 'met', note: 'State filing accepted' },
      {
        item: 'Collection Program',
        status: 'in_progress',
        note: 'Pilot running in 18 stores'
      },
      {
        item: 'Reuse Rate Reporting',
        status: 'in_progress',
        note: 'Q1 data validation underway'
      },
      { item: 'Annual Audit', status: 'required', note: 'External auditor not retained' },
      { item: 'Fee Payment', status: 'advisory', note: 'Modeled for FY 2026 planning' }
    ],
    feeExposure: [
      { complianceLevel: 'Non-Compliance', estimatedFee: 325000, savingsVsNonCompliance: 0 },
      { complianceLevel: 'Partial Compliance', estimatedFee: 214000, savingsVsNonCompliance: 111000 },
      { complianceLevel: 'Near Full Compliance', estimatedFee: 128000, savingsVsNonCompliance: 197000 },
      { complianceLevel: 'Full Compliance', estimatedFee: 82000, savingsVsNonCompliance: 243000 }
    ]
  },
  insights: {
    overview:
      'Poshmark volume increased 23% month over month while overall average resale price held above $210, indicating room to prioritize authenticated premium inventory.',
    platforms:
      'Vestiaire Collective and The RealReal deliver the highest resale prices; reallocating top-condition outerwear to these channels can lift blended retention.',
    compliance:
      'Moving reuse rate from 34% to 42% this year would materially reduce modeled fee exposure and improve SB 707 readiness before annual audit review.'
  }
};
