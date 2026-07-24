export type CampaignStatus = "active" | "paused" | "completed" | "draft";
export type ChannelType = "email" | "social" | "search" | "display" | "content";
export type ContentType = "blog" | "social_post" | "email_campaign" | "landing_page" | "ad_copy" | "video_script";
export type AttributionModelType = "first_touch" | "last_touch" | "linear" | "time_decay" | "position_based" | "data_driven" | "marketing_mix";
export type IdentityResolutionMode = "user_level" | "aggregate_mmm";
export type MeasurementRisk = "low" | "medium" | "high";
export type AIDiscoveryEvidence = "referral_clicks_only" | "mention_citation_tracking" | "brand_lift_study";
export type MeasurementValidationMethod = "platform_attribution" | "incrementality_test" | "marketing_mix_model";
export type AttributionDecisionUse = "budget_ready" | "diagnostic_only" | "strategic_planning";
export type IncrementalityTestDesign = "geo_holdout" | "audience_holdout" | "platform_lift" | "none";
export type ConsentAuditTrailStatus = "complete" | "partial" | "missing";
export type CleanRoomInteroperability = "admap_ready" | "proprietary_only" | "not_applicable";
export type AttributionDataMaturity = "mature" | "provisional";
export type AttributionUncertaintyStatus = "bounded" | "wide" | "not_estimated";
export type BudgetResponseStatus = "headroom" | "diminishing_returns" | "not_estimated";
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
    cleanRoomInteroperability: CleanRoomInteroperability;
    cleanRoomMatchRate: number | null;
    identityGraphMatchRate: number | null;
    identityResolutionMode: IdentityResolutionMode;
    signalLossRisk: MeasurementRisk;
    aiDiscoveryEvidence: AIDiscoveryEvidence;
    zeroClickInfluenceRisk: MeasurementRisk;
    validationMethod: MeasurementValidationMethod;
    incrementalityHoldoutShare: number | null;
    incrementalityTestDesign: IncrementalityTestDesign;
    incrementalityReadoutWindowDays: number | null;
    conversionReportingLagHours: number | null;
    dataMaturity: AttributionDataMaturity;
    marginalRoiEstimate: number | null;
    budgetResponseStatus: BudgetResponseStatus;
    roiEstimateRange: { lower: number; upper: number; confidenceLevel: number } | null;
    roiUncertaintyStatus: AttributionUncertaintyStatus;
    businessOutcomeKpi: string;
    cookielessReady: boolean;
  };
}

export interface AttributionDecisionReadiness {
  modelId: string;
  modelName: string;
  decisionUse: AttributionDecisionUse;
  blockers: string[];
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
