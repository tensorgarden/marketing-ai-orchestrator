export type CampaignStatus = "active" | "paused" | "completed" | "draft";
export type ChannelType = "email" | "social" | "search" | "display" | "content";
export type ContentType = "blog" | "social_post" | "email_campaign" | "landing_page" | "ad_copy" | "video_script";
export type AttributionModelType = "first_touch" | "last_touch" | "linear" | "time_decay" | "position_based" | "data_driven" | "marketing_mix";
export type IdentityResolutionMode = "user_level" | "aggregate_mmm";
export type MeasurementRisk = "low" | "medium" | "high";
export type MeasurementValidationMethod = "platform_attribution" | "incrementality_test" | "marketing_mix_model";
export type ConsentAuditTrailStatus = "complete" | "partial" | "missing";
export type AIContentStatus = "draft" | "review" | "approved" | "published";
export type CampaignGoal = "awareness" | "lead_gen" | "conversion" | "retention" | "upsell";
export type AISentiment = "positive" | "neutral" | "persuasive";

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roas: number;
  cpa: number;
  ctr: number;
  revenue: number;
}

export interface ContentAsset {
  id: string;
  campaignId: string;
  title: string;
  type: ContentType;
  channel: ChannelType;
  aiScore: number;
  status: AIContentStatus;
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    engagement: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AttributionModel {
  id: string;
  name: string;
  type: AttributionModelType;
  channels: { channelId: string; attribution: number }[];
  accuracy: number;
  privacySignals: {
    firstPartyCoverage: number;
    serverSideEventCoverage: number;
    modeledConversionShare: number;
    consentedEventShare: number;
    consentAuditTrailStatus: ConsentAuditTrailStatus;
    identityGraphMatchRate: number | null;
    identityResolutionMode: IdentityResolutionMode;
    signalLossRisk: MeasurementRisk;
    validationMethod: MeasurementValidationMethod;
    incrementalityHoldoutShare: number | null;
    businessOutcomeKpi: string;
    cookielessReady: boolean;
  };
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: CampaignStatus;
  goal: CampaignGoal;
  channels: Channel[];
  contentAssets: ContentAsset[];
  budget: number;
  spend: number;
  revenue: number;
  roas: number;
  conversionRate: number;
  impressions: number;
  clicks: number;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIGeneratedContent {
  id: string;
  campaignId: string;
  title: string;
  type: ContentType;
  channel: ChannelType;
  preview: string;
  score: number;
  keywords: string[];
  sentiment: AISentiment;
  generatedAt: string;
}

export interface MarketingMetrics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalBudget: number;
  totalSpend: number;
  totalRevenue: number;
  overallROAS: number;
  avgConversionRate: number;
  totalImpressions: number;
  totalClicks: number;
  channelBreakdown: { channel: ChannelType; revenue: number; roas: number; spend: number }[];
  topPerformingAsset: string;
  aiContentGenerated: number;
}
