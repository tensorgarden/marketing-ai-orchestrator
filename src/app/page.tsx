"use client";

import { useMemo } from "react";
import { clsx } from "clsx";
import { campaigns, channels, contentAssets, attributionModels, aiGeneratedContent, computeMetrics } from "@/lib/demo-data";
import { StatusDot, Badge, Card, ProgressBar, StatCard } from "@/components/ui";
import type {
  AIDiscoveryEvidence,
  Campaign,
  CleanRoomInteroperability,
  ConsentAuditTrailStatus,
  IncrementalityTestDesign,
  MeasurementRisk,
  MeasurementValidationMethod,
  AttributionUncertaintyStatus,
  BudgetResponseStatus,
} from "@/lib/types";

// ── Helpers ────────────────────────────────────────────────────────────────
function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function roasVariant(roas: number): "success" | "warning" | "danger" | "default" {
  if (roas >= 4.0) return "success";
  if (roas >= 2.5) return "warning";
  if (roas >= 1.0) return "danger";
  return "default";
}

function aiScoreVariant(score: number): "success" | "warning" | "danger" {
  if (score >= 85) return "success";
  if (score >= 70) return "warning";
  return "danger";
}

function sentimentColor(s: string): string {
  const map: Record<string, string> = {
    positive: "text-emerald-600",
    neutral: "text-slate-500",
    persuasive: "text-blue-600",
  };
  return map[s] ?? "text-slate-500";
}

function goalLabel(goal: string): string {
  const map: Record<string, string> = {
    awareness: "Awareness",
    lead_gen: "Lead Gen",
    conversion: "Conversion",
    retention: "Retention",
    upsell: "Upsell",
  };
  return map[goal] ?? goal;
}

function signalLossClass(risk: MeasurementRisk): string {
  const map: Record<MeasurementRisk, string> = {
    low: "bg-emerald-50 text-emerald-700",
    medium: "bg-amber-50 text-amber-700",
    high: "bg-red-50 text-red-700",
  };
  return map[risk];
}

function aiDiscoveryEvidenceLabel(evidence: AIDiscoveryEvidence): string {
  const map: Record<AIDiscoveryEvidence, string> = {
    referral_clicks_only: "Referral clicks only",
    mention_citation_tracking: "Mentions + citations",
    brand_lift_study: "Brand lift study",
  };
  return map[evidence];
}

function consentAuditClass(status: ConsentAuditTrailStatus): string {
  const map: Record<ConsentAuditTrailStatus, string> = {
    complete: "bg-emerald-50 text-emerald-700",
    partial: "bg-amber-50 text-amber-700",
    missing: "bg-red-50 text-red-700",
  };
  return map[status];
}

function cleanRoomInteroperabilityLabel(status: CleanRoomInteroperability): string {
  const map: Record<CleanRoomInteroperability, string> = {
    admap_ready: "ADMaP ready",
    proprietary_only: "Proprietary only",
    not_applicable: "Not applicable",
  };
  return map[status];
}

function validationMethodLabel(method: MeasurementValidationMethod): string {
  const map: Record<MeasurementValidationMethod, string> = {
    platform_attribution: "Platform attribution",
    incrementality_test: "Incrementality test",
    marketing_mix_model: "Marketing mix model",
  };
  return map[method];
}

function incrementalityTestLabel(design: IncrementalityTestDesign): string {
  const map: Record<IncrementalityTestDesign, string> = {
    geo_holdout: "Geo holdout",
    audience_holdout: "Audience holdout",
    platform_lift: "Platform lift",
    none: "No holdout",
  };
  return map[design];
}

function budgetResponseClass(status: BudgetResponseStatus): string {
  const map: Record<BudgetResponseStatus, string> = {
    headroom: "bg-emerald-50 text-emerald-700",
    diminishing_returns: "bg-red-50 text-red-700",
    not_estimated: "bg-slate-100 text-slate-600",
  };
  return map[status];
}

function roiUncertaintyClass(status: AttributionUncertaintyStatus): string {
  const map: Record<AttributionUncertaintyStatus, string> = {
    bounded: "bg-emerald-50 text-emerald-700",
    wide: "bg-red-50 text-red-700",
    not_estimated: "bg-slate-100 text-slate-600",
  };
  return map[status];
}

// ── Campaign Row ───────────────────────────────────────────────────────────
function CampaignRow({ campaign }: { campaign: Campaign }) {
  const roasVar = roasVariant(campaign.roas);
  const spendPct = Math.round((campaign.spend / campaign.budget) * 100);

  return (
    <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <StatusDot status={campaign.status} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {campaign.name}
            </h3>
            <Badge variant={campaign.status === "active" ? "success" : "neutral"}>
              {campaign.status}
            </Badge>
            <Badge variant="info">{goalLabel(campaign.goal)}</Badge>
          </div>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {campaign.description}
          </p>
          <div className="mt-1 flex gap-2">
            {campaign.channels.map((ch) => (
              <Badge key={ch.id} variant="neutral">
                {ch.type}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
        <div className="text-center">
          <p className="font-mono text-sm font-semibold text-slate-900">
            {formatCurrency(campaign.spend)}
          </p>
          <p>of {formatCurrency(campaign.budget)}</p>
        </div>
        <div className="text-center">
          <p className={clsx("font-mono text-sm font-semibold", roasVar === "success" ? "text-emerald-600" : roasVar === "warning" ? "text-amber-600" : "text-red-600")}>
            {campaign.roas}x
          </p>
          <p>ROAS</p>
        </div>
        <div className="text-center">
          <p className="font-mono text-sm font-semibold text-slate-900">
            {campaign.conversionRate}%
          </p>
          <p>conv. rate</p>
        </div>
        <div className="w-28">
          <ProgressBar
            value={spendPct}
            max={100}
            showValue
            label="Budget"
            variant={spendPct > 90 ? "warning" : spendPct > 70 ? "info" : "success"}
          />
        </div>
      </div>
    </Card>
  );
}

// ── Channel Attribution Breakdown ──────────────────────────────────────────
function ChannelAttribution() {
  const model = attributionModels[0]; // data-driven

  return (
    <Card>
      <h2 className="mb-4 text-sm font-semibold text-slate-900">
        Channel Attribution Breakdown
      </h2>
      <p className="mb-2 text-xs text-slate-400">
        Model: {model.name} (accuracy: {model.accuracy}%)
      </p>
      <div className="mb-3 flex flex-wrap gap-2">
        {model.privacySignals.cookielessReady && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
            Cookieless Ready
          </span>
        )}
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
          1P Coverage: {model.privacySignals.firstPartyCoverage}%
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700">
          Server-side Events: {model.privacySignals.serverSideEventCoverage}%
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
          Consented: {model.privacySignals.consentedEventShare}%
        </span>
        <span className={clsx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", consentAuditClass(model.privacySignals.consentAuditTrailStatus))}>
          Consent Audit: {model.privacySignals.consentAuditTrailStatus}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700">
          DCR: {cleanRoomInteroperabilityLabel(model.privacySignals.cleanRoomInteroperability)}
        </span>
        {model.privacySignals.cleanRoomMatchRate !== null && (
          <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2 py-0.5 text-xs font-medium text-cyan-700">
            DCR Match: {model.privacySignals.cleanRoomMatchRate}%
          </span>
        )}
        {model.privacySignals.modeledConversionShare > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-600">
            Modeled: {model.privacySignals.modeledConversionShare}%
          </span>
        )}
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
          {model.privacySignals.identityGraphMatchRate === null
            ? "Aggregate MMM"
            : `Identity Match: ${model.privacySignals.identityGraphMatchRate}%`}
        </span>
        <span className={clsx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", signalLossClass(model.privacySignals.signalLossRisk))}>
          Signal Loss: {model.privacySignals.signalLossRisk}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
          AI discovery: {aiDiscoveryEvidenceLabel(model.privacySignals.aiDiscoveryEvidence)}
        </span>
        <span className={clsx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", signalLossClass(model.privacySignals.zeroClickInfluenceRisk))}>
          Zero-click risk: {model.privacySignals.zeroClickInfluenceRisk}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
          Validation: {validationMethodLabel(model.privacySignals.validationMethod)}
        </span>
        {model.privacySignals.incrementalityTestDesign !== "none" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
            Test: {incrementalityTestLabel(model.privacySignals.incrementalityTestDesign)}
          </span>
        )}
        {model.privacySignals.incrementalityHoldoutShare !== null && (
          <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2 py-0.5 text-xs font-medium text-cyan-700">
            Holdout: {model.privacySignals.incrementalityHoldoutShare}%
          </span>
        )}
        {model.privacySignals.incrementalityReadoutWindowDays !== null && (
          <span className="inline-flex items-center gap-1 rounded-full bg-lime-50 px-2 py-0.5 text-xs font-medium text-lime-700">
            Readout: {model.privacySignals.incrementalityReadoutWindowDays}d
          </span>
        )}
        {model.privacySignals.conversionReportingLagHours !== null && (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
            Conversion lag: {model.privacySignals.conversionReportingLagHours}h
          </span>
        )}
        <span className={clsx(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
          model.privacySignals.dataMaturity === "mature"
            ? "bg-emerald-50 text-emerald-700"
            : "bg-amber-50 text-amber-700"
        )}>
          Data: {model.privacySignals.dataMaturity}
        </span>
        {model.privacySignals.marginalRoiEstimate !== null && (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
            Marginal ROI: {model.privacySignals.marginalRoiEstimate}x
          </span>
        )}
        <span className={clsx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", budgetResponseClass(model.privacySignals.budgetResponseStatus))}>
          Budget response: {model.privacySignals.budgetResponseStatus.replace("_", " ")}
        </span>
        {model.privacySignals.roiEstimateRange !== null && (
          <span className="inline-flex items-center gap-1 rounded-full bg-fuchsia-50 px-2 py-0.5 text-xs font-medium text-fuchsia-700">
            ROI range: {model.privacySignals.roiEstimateRange.lower}–{model.privacySignals.roiEstimateRange.upper}x ({model.privacySignals.roiEstimateRange.confidenceLevel}%)
          </span>
        )}
        <span className={clsx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", roiUncertaintyClass(model.privacySignals.roiUncertaintyStatus))}>
          ROI uncertainty: {model.privacySignals.roiUncertaintyStatus.replace("_", " ")}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
          KPI: {model.privacySignals.businessOutcomeKpi}
        </span>
      </div>
      <div className="space-y-3">
        {model.channels.map((ac) => {
          const ch = channels.find((c) => c.id === ac.channelId);
          if (!ch) return null;
          return (
            <div key={ac.channelId} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 capitalize">{ch.type}</span>
                <span className="text-slate-500">
                  {ac.attribution}% attribution | ROAS: {ch.roas}x | {formatCurrency(ch.revenue)}
                </span>
              </div>
              <ProgressBar
                value={ac.attribution}
                max={100}
                variant={ch.roas >= 4 ? "success" : ch.roas >= 2.5 ? "warning" : "danger"}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Content Asset Library ──────────────────────────────────────────────────
function ContentAssetLibrary() {
  const sorted = [...contentAssets].sort((a, b) => b.aiScore - a.aiScore);

  return (
    <Card>
      <h2 className="mb-4 text-sm font-semibold text-slate-900">
        Content Asset Library -- AI Quality Scores
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="pb-2 pr-3 font-medium">Asset</th>
              <th className="pb-2 pr-3 font-medium">Type</th>
              <th className="pb-2 pr-3 font-medium">Channel</th>
              <th className="pb-2 pr-3 font-medium">AI Score</th>
              <th className="pb-2 pr-3 font-medium">Status</th>
              <th className="pb-2 pr-3 font-medium">Impressions</th>
              <th className="pb-2 font-medium">Conv.</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((asset) => (
              <tr key={asset.id} className="border-b border-slate-50">
                <td className="py-2 pr-3 font-medium text-slate-700">
                  {asset.title}
                </td>
                <td className="py-2 pr-3">
                  <Badge variant="info">{asset.type.replace("_", " ")}</Badge>
                </td>
                <td className="py-2 pr-3 capitalize text-slate-500">{asset.channel}</td>
                <td className="py-2 pr-3">
                  <span className={clsx(
                    "font-mono font-semibold",
                    asset.aiScore >= 85 ? "text-emerald-600" : asset.aiScore >= 70 ? "text-amber-600" : "text-red-600"
                  )}>
                    {asset.aiScore}
                  </span>
                </td>
                <td className="py-2 pr-3">
                  <Badge variant={asset.status === "published" ? "success" : asset.status === "approved" ? "info" : asset.status === "review" ? "warning" : "neutral"}>
                    {asset.status}
                  </Badge>
                </td>
                <td className="py-2 pr-3 font-mono text-slate-500">
                  {asset.performance.impressions > 0 ? formatNumber(asset.performance.impressions) : "--"}
                </td>
                <td className="py-2 font-mono text-slate-500">
                  {asset.performance.conversions > 0 ? asset.performance.conversions : "--"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ── AI Generated Content Previews ──────────────────────────────────────────
function AIContentPreviews() {
  return (
    <Card>
      <h2 className="mb-4 text-sm font-semibold text-slate-900">
        AI-Generated Content Previews
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {aiGeneratedContent.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-slate-200 bg-slate-50 p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <Badge variant="info">{item.type.replace("_", " ")}</Badge>
              <span className={clsx("text-xs font-medium", sentimentColor(item.sentiment))}>
                {item.sentiment}
              </span>
            </div>
            <h3 className="mb-2 text-sm font-semibold text-slate-800">{item.title}</h3>
            <p className="mb-3 line-clamp-4 text-xs leading-relaxed text-slate-500">
              {item.preview}
            </p>
            <div className="mb-2 flex flex-wrap gap-1">
              {item.keywords.map((kw) => (
                <span key={kw} className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
                  {kw}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                AI Score:
                <span className={clsx("font-mono font-semibold", aiScoreVariant(item.score) === "success" ? "text-emerald-600" : "text-amber-600")}>
                  {item.score}
                </span>
              </span>
              <span>{item.channel}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Marketing Calendar ─────────────────────────────────────────────────────
function MarketingCalendar() {
  const active = campaigns.filter((c) => c.status === "active");

  return (
    <Card>
      <h2 className="mb-4 text-sm font-semibold text-slate-900">
        Marketing Calendar / Roadmap
      </h2>
      <div className="space-y-3">
        {active.map((c) => {
          const start = new Date(c.startDate);
          const end = c.endDate ? new Date(c.endDate) : null;
          const now = new Date();
          const totalDuration = end ? end.getTime() - start.getTime() : 90 * 24 * 60 * 60 * 1000;
          const elapsed = now.getTime() - start.getTime();
          const pct = Math.min(Math.round((elapsed / totalDuration) * 100), 100);

          return (
            <div key={c.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">{c.name}</span>
                <span className="text-slate-400">
                  {c.startDate} {end ? `-- ${c.endDate!}` : "(ongoing)"}
                </span>
              </div>
              <ProgressBar
                value={pct}
                max={100}
                showValue
                variant={pct >= 80 ? "warning" : "info"}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function Page() {
  const metrics = useMemo(() => computeMetrics(), []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Marketing AI Orchestrator
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Campaign Optimization &amp; Multi-Channel Analytics
        </p>
      </div>

      {/* Hero Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Active Campaigns"
          value={`${metrics.activeCampaigns}/${metrics.totalCampaigns}`}
          subtitle="running now"
          variant="success"
        />
        <StatCard
          label="Total Spend"
          value={formatCurrency(metrics.totalSpend)}
          subtitle={`of ${formatCurrency(metrics.totalBudget)} budget`}
          variant="default"
        />
        <StatCard
          label="Overall ROAS"
          value={`${metrics.overallROAS}x`}
          subtitle={`${formatCurrency(metrics.totalRevenue)} revenue`}
          variant={metrics.overallROAS >= 3.5 ? "success" : metrics.overallROAS >= 2.0 ? "warning" : "danger"}
        />
        <StatCard
          label="Avg. Conversion Rate"
          value={`${metrics.avgConversionRate}%`}
          subtitle={`${formatNumber(metrics.totalClicks)} total clicks`}
          variant="default"
        />
      </div>

      {/* Campaign Performance Grid */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Campaign Performance
        </h2>
        <div className="space-y-3">
          {campaigns.map((c) => (
            <CampaignRow key={c.id} campaign={c} />
          ))}
        </div>
      </div>

      {/* Two-column: Attribution + Content */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <ChannelAttribution />
        <ContentAssetLibrary />
      </div>

      {/* AI Content Previews */}
      <div className="mb-8">
        <AIContentPreviews />
      </div>

      {/* Marketing Calendar */}
      <div className="mb-8">
        <MarketingCalendar />
      </div>
    </div>
  );
}
