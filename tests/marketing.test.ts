import { describe, it, expect } from "vitest";
import {
  campaigns,
  channels,
  contentAssets,
  attributionModels,
  aiGeneratedContent,
  computeMetrics,
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
      expect(m.privacySignals.modeledConversionShare).toBeGreaterThanOrEqual(0);
      expect(m.privacySignals.modeledConversionShare).toBeLessThanOrEqual(100);
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
