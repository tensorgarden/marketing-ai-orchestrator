import { describe, it, expect } from "vitest";
import {
  campaigns,
  channels,
  contentAssets,
  attributionModels,
  aiGeneratedContent,
  computeMetrics,
  getAttributionDecisionReadiness,
} from "@/lib/demo-data";

describe("demo-data: campaigns", () => {
  it("should have exactly 8 campaigns", () => {
    expect(campaigns).toHaveLength(8);
  });

  it("should have all 8 campaigns active", () => {
    const active = campaigns.filter((c) => c.status === "active");
    expect(active.length).toBe(8);
  });

  it("should include campaigns across all goal types", () => {
    const goals = new Set(campaigns.map((c) => c.goal));
    expect(goals.has("conversion")).toBe(true);
    expect(goals.has("awareness")).toBe(true);
    expect(goals.has("retention")).toBe(true);
    expect(goals.has("lead_gen")).toBe(true);
  });

  it("should have a positive ROAS for every campaign", () => {
    for (const c of campaigns) {
      expect(c.roas).toBeGreaterThan(0);
      expect(c.revenue).toBeGreaterThan(0);
    }
  });

  it("should have at least one channel per campaign", () => {
    for (const c of campaigns) {
      expect(c.channels.length).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("demo-data: channels", () => {
  it("should have exactly 5 channels", () => {
    expect(channels).toHaveLength(5);
  });

  it("should include all required channel types", () => {
    const types = new Set(channels.map((ch) => ch.type));
    expect(types.has("email")).toBe(true);
    expect(types.has("social")).toBe(true);
    expect(types.has("search")).toBe(true);
    expect(types.has("display")).toBe(true);
    expect(types.has("content")).toBe(true);
  });

  it("should have positive spend and revenue for each channel", () => {
    for (const ch of channels) {
      expect(ch.spend).toBeGreaterThan(0);
      expect(ch.revenue).toBeGreaterThan(0);
      expect(ch.roas).toBeGreaterThan(0);
    }
  });
});

describe("demo-data: contentAssets", () => {
  it("should have exactly 15 content assets", () => {
    expect(contentAssets).toHaveLength(15);
  });

  it("should have valid AI scores between 0 and 100", () => {
    for (const a of contentAssets) {
      expect(a.aiScore).toBeGreaterThanOrEqual(0);
      expect(a.aiScore).toBeLessThanOrEqual(100);
    }
  });

  it("should include assets across multiple statuses", () => {
    const statuses = new Set(contentAssets.map((a) => a.status));
    expect(statuses.size).toBeGreaterThanOrEqual(3);
  });
});

describe("demo-data: attributionModels", () => {
  it("should have at least 2 attribution models", () => {
    expect(attributionModels.length).toBeGreaterThanOrEqual(2);
  });

  it("should have at least 3 attribution models", () => {
    expect(attributionModels.length).toBeGreaterThanOrEqual(3);
  });

  it("should have channel attributions summing to 100", () => {
    for (const m of attributionModels) {
      const total = m.channels.reduce((s, c) => s + c.attribution, 0);
      expect(total).toBe(100);
    }
  });

  it("should track privacy-first attribution readiness signals", () => {
    for (const m of attributionModels) {
      expect(m.privacySignals.firstPartyCoverage).toBeGreaterThanOrEqual(0);
      expect(m.privacySignals.firstPartyCoverage).toBeLessThanOrEqual(100);
      expect(m.privacySignals.consentedEventShare).toBeGreaterThanOrEqual(0);
      expect(m.privacySignals.consentedEventShare).toBeLessThanOrEqual(100);
      expect(m.privacySignals.serverSideEventCoverage).toBeGreaterThanOrEqual(0);
      expect(m.privacySignals.serverSideEventCoverage).toBeLessThanOrEqual(100);
      expect(["complete", "partial", "missing"]).toContain(m.privacySignals.consentAuditTrailStatus);
      expect(m.privacySignals.modeledConversionShare).toBeGreaterThanOrEqual(0);
      expect(m.privacySignals.modeledConversionShare).toBeLessThanOrEqual(100);
      if (m.privacySignals.identityGraphMatchRate !== null) {
        expect(m.privacySignals.identityGraphMatchRate).toBeGreaterThanOrEqual(0);
        expect(m.privacySignals.identityGraphMatchRate).toBeLessThanOrEqual(100);
      }
    }
  });

  it("should flag user-level models below 70% identity match as signal-loss risk", () => {
    for (const m of attributionModels) {
      const matchRate = m.privacySignals.identityGraphMatchRate;
      if (m.privacySignals.identityResolutionMode === "user_level" && matchRate !== null && matchRate < 70) {
        expect(["medium", "high"]).toContain(m.privacySignals.signalLossRisk);
      }
    }
  });

  it("should expose outcome-proof validation signals for attribution models", () => {
    for (const m of attributionModels) {
      expect(["platform_attribution", "incrementality_test", "marketing_mix_model"]).toContain(
        m.privacySignals.validationMethod
      );
      expect(m.privacySignals.businessOutcomeKpi.length).toBeGreaterThan(0);
      const holdout = m.privacySignals.incrementalityHoldoutShare;
      if (holdout !== null) {
        expect(holdout).toBeGreaterThan(0);
        expect(holdout).toBeLessThanOrEqual(50);
      }
    }
  });

  it("should define concrete incrementality test design metadata", () => {
    for (const m of attributionModels) {
      expect(["geo_holdout", "audience_holdout", "platform_lift", "none"]).toContain(
        m.privacySignals.incrementalityTestDesign
      );
      const readout = m.privacySignals.incrementalityReadoutWindowDays;
      if (readout !== null) {
        expect(readout).toBeGreaterThanOrEqual(14);
        expect(readout).toBeLessThanOrEqual(90);
      }
    }
  });

  it("incrementality-tested attribution should name a holdout design and readout window", () => {
    for (const m of attributionModels.filter((model) => model.privacySignals.validationMethod === "incrementality_test")) {
      expect(m.privacySignals.incrementalityTestDesign).not.toBe("none");
      expect(m.privacySignals.incrementalityReadoutWindowDays).not.toBeNull();
    }
  });

  it("platform-only attribution should not imply an incrementality holdout", () => {
    for (const m of attributionModels.filter((model) => model.privacySignals.validationMethod === "platform_attribution")) {
      expect(m.privacySignals.incrementalityTestDesign).toBe("none");
      expect(m.privacySignals.incrementalityReadoutWindowDays).toBeNull();
    }
  });

  it("cookieless-ready models should use outcome-proof validation, not platform-only attribution", () => {
    const outcomeProofMethods = new Set(["incrementality_test", "marketing_mix_model"]);
    for (const m of attributionModels.filter((model) => model.privacySignals.cookielessReady)) {
      expect(outcomeProofMethods.has(m.privacySignals.validationMethod)).toBe(true);
    }
  });

  it("cookieless-ready models should preserve server-side event evidence and consent audit trails", () => {
    for (const m of attributionModels.filter((model) => model.privacySignals.cookielessReady)) {
      expect(m.privacySignals.serverSideEventCoverage).toBeGreaterThanOrEqual(85);
      expect(m.privacySignals.consentAuditTrailStatus).toBe("complete");
    }
  });

  it("should include an incrementality holdout for at least one user-level model", () => {
    const tested = attributionModels.find((m) => m.privacySignals.validationMethod === "incrementality_test");
    expect(tested).toBeDefined();
    expect(tested!.privacySignals.identityResolutionMode).toBe("user_level");
    expect(tested!.privacySignals.incrementalityHoldoutShare).toBeGreaterThan(0);
  });

  it("cookieless-ready models should avoid weak identity-graph dependency", () => {
    for (const m of attributionModels.filter((model) => model.privacySignals.cookielessReady)) {
      const matchRate = m.privacySignals.identityGraphMatchRate;
      const isAggregateMmm = m.privacySignals.identityResolutionMode === "aggregate_mmm";
      expect(isAggregateMmm || (matchRate !== null && matchRate >= 70)).toBe(true);
    }
  });

  it("should include at least one cookieless-ready attribution model", () => {
    expect(attributionModels.some((m) => m.privacySignals.cookielessReady)).toBe(true);
  });

  it("should have at least two cookieless-ready models for buyer confidence", () => {
    const ready = attributionModels.filter((m) => m.privacySignals.cookielessReady);
    expect(ready.length).toBeGreaterThanOrEqual(2);
  });

  it("MMM model should use zero-modeled conversions with high first-party coverage", () => {
    const mmm = attributionModels.find((m) => m.name === "Marketing Mix Model (MMM)");
    expect(mmm).toBeDefined();
    expect(mmm!.privacySignals.modeledConversionShare).toBe(0);
    expect(mmm!.privacySignals.firstPartyCoverage).toBeGreaterThanOrEqual(90);
    expect(mmm!.privacySignals.cookielessReady).toBe(true);
    expect(mmm!.privacySignals.identityResolutionMode).toBe("aggregate_mmm");
    expect(mmm!.privacySignals.identityGraphMatchRate).toBeNull();
  });

  it("MMM model should carry the marketing_mix type to distinguish aggregate modeling from user-level MTA", () => {
    const mmm = attributionModels.find((m) => m.name === "Marketing Mix Model (MMM)");
    expect(mmm).toBeDefined();
    expect(mmm!.type).toBe("marketing_mix");
  });

  it("should use a distinct attribution type per model — no two models share the same methodology", () => {
    const types = new Set(attributionModels.map((m) => m.type));
    expect(types.size).toBe(attributionModels.length);
  });

  it("should produce decision-readiness records for every attribution model", () => {
    const readiness = getAttributionDecisionReadiness();
    expect(readiness).toHaveLength(attributionModels.length);
    expect(readiness.map((r) => r.modelId)).toEqual(attributionModels.map((m) => m.id));
  });

  it("should keep high signal-loss platform attribution diagnostic-only", () => {
    const readiness = getAttributionDecisionReadiness();
    const timeDecay = readiness.find((r) => r.modelName === "Time Decay Model");
    expect(timeDecay).toBeDefined();
    expect(timeDecay!.decisionUse).toBe("diagnostic_only");
    expect(timeDecay!.blockers).toContain("Needs incrementality or MMM validation before budget decisions");
    expect(timeDecay!.blockers).toContain("Identity graph match rate below 70%");
  });

  it("should separate incrementality-tested budget decisions from MMM strategic planning", () => {
    const readiness = getAttributionDecisionReadiness();
    expect(readiness.find((r) => r.modelName === "Data-Driven Attribution")?.decisionUse).toBe("budget_ready");
    expect(readiness.find((r) => r.modelName === "Marketing Mix Model (MMM)")?.decisionUse).toBe("strategic_planning");
  });
});

describe("demo-data: aiGeneratedContent", () => {
  it("should have at least 5 AI-generated content items", () => {
    expect(aiGeneratedContent.length).toBeGreaterThanOrEqual(5);
  });

  it("should have valid scores and keywords for each AI item", () => {
    for (const item of aiGeneratedContent) {
      expect(item.score).toBeGreaterThanOrEqual(0);
      expect(item.score).toBeLessThanOrEqual(100);
      expect(item.keywords.length).toBeGreaterThanOrEqual(1);
      expect(item.preview.length).toBeGreaterThan(0);
    }
  });
});

describe("demo-data: computeMetrics", () => {
  it("should return correct totalCampaigns count", () => {
    const m = computeMetrics();
    expect(m.totalCampaigns).toBe(8);
  });

  it("should return all 8 campaigns active", () => {
    const m = computeMetrics();
    expect(m.activeCampaigns).toBe(8);
  });

  it("should compute overallROAS greater than zero", () => {
    const m = computeMetrics();
    expect(m.overallROAS).toBeGreaterThan(0);
  });

  it("should compute avgConversionRate between 0 and 100", () => {
    const m = computeMetrics();
    expect(m.avgConversionRate).toBeGreaterThanOrEqual(0);
    expect(m.avgConversionRate).toBeLessThanOrEqual(100);
  });

  it("should compute channelBreakdown with all 5 channels", () => {
    const m = computeMetrics();
    expect(m.channelBreakdown).toHaveLength(5);
    for (const cb of m.channelBreakdown) {
      expect(cb.revenue).toBeGreaterThan(0);
    }
  });
});
