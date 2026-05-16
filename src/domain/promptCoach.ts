import { AdviceCard, Importance, Preference, Sentiment } from "@/src/domain/models";
import { id } from "@/src/utils/dates";

export type PromptCategory = "gift" | "size" | "care" | "health_pattern" | "date" | "family" | "sensitive";

export interface CapturePrompt {
  id: string;
  category: PromptCategory;
  title: string;
  detailHint: string;
  fieldTitle: string;
  fieldCategory: string;
  placeholder: string;
  sentiment: Sentiment;
  importance: Importance;
  tags: string[];
  isSensitive: boolean;
}

export interface AdviceTip {
  id: string;
  title: string;
  body: string;
  do: string[];
  avoid: string;
  tags: string[];
}

export const capturePrompts: CapturePrompt[] = [
  {
    id: "gift-safe-bets",
    category: "gift",
    title: "Safe gift lanes",
    detailHint: "What is almost always welcome?",
    fieldTitle: "Safe gift lanes",
    fieldCategory: "Gift ideas",
    placeholder: "Small jewelry, fresh flowers, massage, books by authors she already likes",
    sentiment: "likes",
    importance: "high",
    tags: ["gift", "safe-bet"],
    isSensitive: false
  },
  {
    id: "gift-landmines",
    category: "gift",
    title: "Gift landmines",
    detailHint: "What should you avoid even if it seems logical?",
    fieldTitle: "Gift landmines",
    fieldCategory: "Gift ideas",
    placeholder: "No orange chocolate, no kitchen gadgets as romantic gifts",
    sentiment: "dislikes",
    importance: "critical",
    tags: ["gift", "avoid"],
    isSensitive: false
  },
  {
    id: "sizes",
    category: "size",
    title: "Sizes and fit",
    detailHint: "Clothes, shoes, rings, preferred fit, and where sizes vary.",
    fieldTitle: "Sizes and fit",
    fieldCategory: "Sizes",
    placeholder: "Shoes 38 EU, prefers relaxed fit, ring size unknown",
    sentiment: "important",
    importance: "high",
    tags: ["sizes", "gift"],
    isSensitive: true
  },
  {
    id: "allergies",
    category: "care",
    title: "Allergies and sensitivities",
    detailHint: "Food, flowers, scents, skincare, fabrics, or anything that ruins a plan.",
    fieldTitle: "Allergies and sensitivities",
    fieldCategory: "Care",
    placeholder: "Sensitive to strong perfume, avoids shellfish",
    sentiment: "needs",
    importance: "critical",
    tags: ["care", "health", "avoid"],
    isSensitive: true
  },
  {
    id: "cycle-support",
    category: "health_pattern",
    title: "Monthly support cues",
    detailHint: "Non-diagnostic patterns that help you show up better.",
    fieldTitle: "Monthly support cues",
    fieldCategory: "Support",
    placeholder: "Skin flare-ups, lower energy, wants quiet evenings, heating pad helps",
    sentiment: "needs",
    importance: "high",
    tags: ["cycle", "support", "pattern"],
    isSensitive: true
  },
  {
    id: "stress-support",
    category: "care",
    title: "Stress support rules",
    detailHint: "What helps, what backfires, and when to give space.",
    fieldTitle: "Stress support rules",
    fieldCategory: "Support",
    placeholder: "Handle dinner first, ask before giving advice, do not crowd her",
    sentiment: "needs",
    importance: "high",
    tags: ["support", "stress"],
    isSensitive: true
  },
  {
    id: "favorite-date",
    category: "date",
    title: "Reliable date ideas",
    detailHint: "Low-friction plans she actually enjoys.",
    fieldTitle: "Reliable date ideas",
    fieldCategory: "Date ideas",
    placeholder: "Sushi early, walk after, no loud bars on weeknights",
    sentiment: "likes",
    importance: "medium",
    tags: ["date", "planning"],
    isSensitive: false
  },
  {
    id: "family-dates",
    category: "family",
    title: "Family and friend dates",
    detailHint: "Birthdays, hard anniversaries, visits, or obligations that affect the month.",
    fieldTitle: "Family and friend dates",
    fieldCategory: "Family",
    placeholder: "Her mother's birthday May 21, sister visit in July",
    sentiment: "important",
    importance: "medium",
    tags: ["family", "date"],
    isSensitive: false
  },
  {
    id: "sensitive-topics",
    category: "sensitive",
    title: "Sensitive topics",
    detailHint: "Subjects where timing, tone, or wording matters.",
    fieldTitle: "Sensitive topics",
    fieldCategory: "Sensitive",
    placeholder: "Do not joke about work stress; ask about timing before logistics",
    sentiment: "important",
    importance: "critical",
    tags: ["sensitive", "timing"],
    isSensitive: true
  }
];

export const adviceTips: AdviceTip[] = [
  {
    id: "ask-sizes",
    title: "Ask about sizes without making it weird",
    body: "Make it practical or shared-context, not evaluative. Ask around laundry, shopping, returns, or a brand she already wears.",
    do: [
      "Use exact context: 'What size did that jacket end up being? It fit really well.'",
      "Ask about brand and fit, not body.",
      "If unsure, buy adjustable, returnable, or non-sized gifts."
    ],
    avoid: "Do not ask in a way that sounds like judgment, comparison, or a sudden audit before a big date.",
    tags: ["sizes", "gift"]
  },
  {
    id: "surprise-check",
    title: "Verify a gift without spoiling it",
    body: "Ask preference questions in normal life well before the deadline. When close to the date, switch to safer gifts instead of interrogating.",
    do: [
      "Ask two-choice questions casually: 'Gold or silver usually?'",
      "Use old favorites as anchors.",
      "Confirm dislikes before confirming dreams."
    ],
    avoid: "Do not turn the week before a birthday into a suspicious interview.",
    tags: ["gift", "planning"]
  },
  {
    id: "cycle-patterns",
    title: "Use monthly notes as support, not prediction",
    body: "Track patterns only to prepare care: practical help, gentler timing, supplies, rest, or fewer late logistics.",
    do: [
      "Tag recurring cues like skin flare-ups, migraines, low energy, or sleep disruption.",
      "Write what helps and what backfires.",
      "Treat estimates as prompts to pay attention, not proof."
    ],
    avoid: "Do not use cycle notes to blame mood, predict sex, diagnose health, or win arguments.",
    tags: ["cycle", "support", "health"]
  },
  {
    id: "late-plan",
    title: "When planning is late",
    body: "Move fast, stay honest, and pick something you can execute well. A realistic plan beats a dramatic promise.",
    do: [
      "Book the thing before discussing the thing.",
      "Pair a simple gift with practical relief.",
      "Set one next step you can complete today."
    ],
    avoid: "Do not over-explain why you forgot. Repair through action first.",
    tags: ["panic", "date", "gift"]
  }
];

export function nextCapturePrompts(preferences: Preference[], limit = 4): CapturePrompt[] {
  const covered = new Set(preferences.flatMap((pref) => [
    pref.category.toLowerCase(),
    pref.title.toLowerCase(),
    ...pref.tags.map((tag) => tag.toLowerCase())
  ]));

  return capturePrompts
    .filter((prompt) => !prompt.tags.some((tag) => covered.has(tag)) && !covered.has(prompt.fieldCategory.toLowerCase()))
    .slice(0, limit);
}

export function findCapturePrompt(promptId: string): CapturePrompt | undefined {
  return capturePrompts.find((prompt) => prompt.id === promptId);
}

export function tipsForTags(tags: string[], limit = 2): AdviceTip[] {
  const tagSet = new Set(tags.map((tag) => tag.toLowerCase()));
  return adviceTips.filter((tip) => tip.tags.some((tag) => tagSet.has(tag))).slice(0, limit);
}

export function generatePromptCoachCards(preferences: Preference[], hasSupportWindow: boolean): AdviceCard[] {
  const prompts = nextCapturePrompts(preferences, 3);
  const cards: AdviceCard[] = prompts.map((prompt) => ({
    id: id("prompt"),
    priority: prompt.importance === "critical" ? "medium" : "low",
    title: `Capture: ${prompt.title}`,
    body: prompt.detailHint,
    actionLabel: "Quick capture",
    actionRoute: "/memory",
    relatedEntityType: "preference" as const
  }));

  if (!hasSupportWindow) {
    cards.push({
      id: id("prompt"),
      priority: "low",
      title: "Add support pattern",
      body: "Set a recurring window for stressful weeks, low-energy stretches, or monthly care reminders.",
      actionLabel: "Add support",
      actionRoute: "/support"
    });
  }

  return cards;
}
