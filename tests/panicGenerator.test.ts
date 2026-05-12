import { describe, expect, it } from "vitest";
import { generatePanicIdeas } from "../src/domain/panicGenerator";
import { Preference } from "../src/domain/models";

function preference(overrides: Partial<Preference>): Preference {
  return {
    id: "pref-1",
    partnerId: "partner-1",
    category: "Gift ideas",
    title: "Gift hint",
    value: "Nice dinner",
    sentiment: "wants",
    importance: "medium",
    tags: [],
    isSensitive: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides
  };
}

describe("panicGenerator", () => {
  it("uses saved travel wishes for low-budget ideas", () => {
    const ideas = generatePanicIdeas({
      partnerId: "partner-1",
      budget: "low",
      timeline: "one_week",
      type: "date",
      tone: "practical",
      useSavedPreferences: true,
      toneMode: "standard"
    }, [preference({ category: "Travel", value: "Greece", sentiment: "wants" })]);
    expect(ideas.some((idea) => idea.description.includes("Greece"))).toBe(true);
  });

  it("excludes disliked flowers from generated copy", () => {
    const ideas = generatePanicIdeas({
      partnerId: "partner-1",
      budget: "medium",
      timeline: "one_week",
      type: "gift",
      tone: "practical",
      useSavedPreferences: true,
      toneMode: "standard"
    }, [
      preference({ category: "Flowers", title: "Favorite flowers", value: "roses", sentiment: "likes" }),
      preference({ category: "Flowers", title: "Disliked flowers", value: "roses", sentiment: "dislikes" })
    ]);
    expect(ideas.map((idea) => idea.description).join(" ").toLowerCase()).not.toContain("roses");
  });

  it("avoids shipping-dependent suggestions for urgent timelines", () => {
    const ideas = generatePanicIdeas({
      partnerId: "partner-1",
      budget: "medium",
      timeline: "today",
      type: "gift",
      tone: "practical",
      useSavedPreferences: false,
      toneMode: "roast"
    }, []);
    expect(ideas.some((idea) => idea.description.toLowerCase().includes("avoid anything shipping-dependent"))).toBe(true);
  });
});
