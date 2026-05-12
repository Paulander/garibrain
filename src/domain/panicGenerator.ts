import { Idea, Preference, RelationshipEvent, ToneMode } from "@/src/domain/models";
import { id, nowUtcISO } from "@/src/utils/dates";

export interface PanicRequest {
  partnerId: string;
  occasion?: RelationshipEvent;
  budget: "low" | "medium" | "high" | "unknown";
  timeline: "today" | "few_days" | "one_week" | "two_plus_weeks";
  type: "gift" | "date" | "message" | "trip" | "apology";
  tone: "simple" | "romantic" | "funny" | "practical" | "premium";
  useSavedPreferences: boolean;
  toneMode: ToneMode;
}

export function generatePanicIdeas(request: PanicRequest, preferences: Preference[]): Idea[] {
  const usable = request.useSavedPreferences ? preferences : [];
  const dislikes = usable.filter((pref) => pref.sentiment === "dislikes").map((pref) => `${pref.title} ${pref.value}`.toLowerCase());
  const travelWish = usable.find((pref) => pref.category.toLowerCase() === "travel" && pref.sentiment === "wants");
  const chocolate = usable.find((pref) => pref.category.toLowerCase().includes("chocolate") && pref.sentiment === "likes");
  const flowers = usable.find((pref) => pref.category.toLowerCase().includes("flower") && pref.sentiment === "likes");
  const urgent = request.timeline === "today" || request.timeline === "few_days";
  const ideas: Idea[] = [];

  if (travelWish && request.budget !== "high") {
    ideas.push(makeIdea(request, "Themed dinner date", `Book a local place or cook around "${travelWish.value}". Add a short card about planning the real trip later.`, `It uses the saved travel wish without pretending you can solve an entire trip today.`, "Book or choose the menu today."));
  }

  if (travelWish && request.budget === "high" && !urgent) {
    ideas.push(makeIdea(request, "Weekend trip planning kit", `Draft two realistic trip options, dates, and budget. Present it as a shared choice, not a surprise obligation.`, `It turns "${travelWish.value}" into a concrete plan.`, "Pick two date windows and price the basics."));
  }

  if (chocolate && !dislikes.some((entry) => entry.includes(chocolate.value.toLowerCase()))) {
    ideas.push(makeIdea(request, "Favorite chocolate plus handwritten note", `Get ${chocolate.value} and write one specific thing you appreciate.`, "Low-risk, personal, and fast.", "Buy it before the end of the day."));
  }

  if (flowers && !dislikes.some((entry) => entry.includes(flowers.value.toLowerCase()))) {
    ideas.push(makeIdea(request, "Safe flowers with one concrete plan", `Use ${flowers.value}, then pair it with a real plan like dinner or a chore taken off her plate.`, "Flowers alone are fine; flowers plus effort are better.", "Order pickup instead of relying on delivery timing."));
  }

  if (urgent) {
    ideas.push(makeIdea(request, "Same-day recovery plan", "Use local pickup, a booked table, a clean house, and a direct note. Avoid anything shipping-dependent.", "The timeline is tight, so realism beats theatrics.", "Make the reservation or pickup order now."));
  }

  ideas.push(makeIdea(request, "Practical relief block", "Handle dinner, cleanup, and one annoying errand without making it a performance.", "Practical help is usually harder to fake and easier to feel.", "Choose the errand and put it on your calendar."));
  ideas.push(makeIdea(request, "Memory-based message", "Write three sentences: what you remember, why it matters, and what you are doing next.", "A short specific message beats generic romance copy.", "Draft it, then remove anything that sounds like an excuse."));

  return ideas.slice(0, 10);
}

function makeIdea(request: PanicRequest, title: string, description: string, whyItFits: string, nextStep: string): Idea {
  const timestamp = nowUtcISO();
  return {
    id: id("idea"),
    partnerId: request.partnerId,
    ideaType: request.type === "date" ? "date" : request.type,
    occasionEventId: request.occasion?.id,
    title,
    description,
    whyItFits,
    budget: request.budget,
    urgency: request.timeline,
    nextStep,
    saved: false,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}
