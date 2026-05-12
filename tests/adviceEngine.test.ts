import { describe, expect, it } from "vitest";
import { generateAdviceCards } from "../src/domain/adviceEngine";
import { RelationshipEvent } from "../src/domain/models";

const event: RelationshipEvent = {
  id: "event-1",
  partnerId: "partner-1",
  title: "Anniversary",
  eventType: "anniversary",
  date: "2026-05-19",
  recurrence: "yearly",
  leadTimeDays: [14, 7, 1],
  linkedPreferenceIds: [],
  isSensitive: false,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z"
};

describe("adviceEngine", () => {
  it("creates urgent advice for a near anniversary without a saved idea", () => {
    const cards = generateAdviceCards({
      today: "2026-05-12",
      toneMode: "tactical",
      events: [event],
      preferences: [],
      supportWindows: [],
      debriefs: [],
      ideas: []
    });
    expect(cards[0]).toMatchObject({ priority: "urgent", actionLabel: "Open Panic Helper" });
    expect(cards[0].body).toContain("panic mode");
  });

  it("uses support language without danger framing", () => {
    const cards = generateAdviceCards({
      today: "2026-05-12",
      toneMode: "roast",
      events: [],
      preferences: [],
      supportWindows: [{
        id: "support-1",
        partnerId: "partner-1",
        kind: "pre_period",
        label: "Pre-period support window",
        startDate: "2026-05-13",
        endDate: "2026-05-15",
        confidence: "medium",
        supportActions: ["handle dinner"]
      }],
      debriefs: [],
      ideas: []
    });
    const text = `${cards[0].title} ${cards[0].body}`.toLowerCase();
    expect(text).toContain("support window");
    expect(text).not.toContain("danger");
  });
});
