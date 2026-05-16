import { describe, expect, it } from "vitest";
import { Preference } from "../src/domain/models";
import { generatePromptCoachCards, nextCapturePrompts, tipsForTags } from "../src/domain/promptCoach";

const preference: Preference = {
  id: "pref-1",
  partnerId: "partner-1",
  category: "Sizes",
  title: "Sizes and fit",
  value: "Shoes 38 EU",
  sentiment: "important",
  importance: "high",
  tags: ["sizes", "gift"],
  isSensitive: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z"
};

describe("promptCoach", () => {
  it("skips prompts covered by existing preference tags", () => {
    const prompts = nextCapturePrompts([preference], 5);
    expect(prompts.map((prompt) => prompt.id)).not.toContain("sizes");
  });

  it("creates advice cards for missing guided capture areas", () => {
    const cards = generatePromptCoachCards([], false);
    expect(cards.some((card) => card.title.includes("Capture:"))).toBe(true);
    expect(cards.some((card) => card.title === "Add support pattern")).toBe(true);
  });

  it("returns practical tips by tag", () => {
    const tips = tipsForTags(["sizes"]);
    expect(tips[0].title).toContain("sizes");
    expect(tips[0].avoid.toLowerCase()).not.toContain("insult");
  });
});
