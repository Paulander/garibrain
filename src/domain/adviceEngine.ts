import { AdviceCard, Debrief, Idea, Preference, RelationshipEvent, ToneMode } from "@/src/domain/models";
import { SupportWindow } from "@/src/domain/cycleEngine";
import { daysBetween, daysUntil, id, isWithinInclusive } from "@/src/utils/dates";
import { eventAdviceCopy, supportCopy } from "@/src/utils/tone";
import { nextEventOccurrence } from "@/src/domain/recurrence";

export interface AdviceInput {
  today: string;
  toneMode: ToneMode;
  events: RelationshipEvent[];
  preferences: Preference[];
  supportWindows: SupportWindow[];
  debriefs: Debrief[];
  ideas: Idea[];
}

export function generateAdviceCards(input: AdviceInput): AdviceCard[] {
  const cards: AdviceCard[] = [];

  for (const event of input.events) {
    const occurrence = nextEventOccurrence(event, input.today);
    const days = daysUntil(occurrence, input.today);
    const hasSavedIdea = input.ideas.some((idea) => idea.occasionEventId === event.id && idea.saved);
    if ((event.eventType === "birthday" || event.eventType === "anniversary") && days <= 7 && days >= 0 && !hasSavedIdea) {
      const copy = eventAdviceCopy(input.toneMode, event.title, days);
      cards.push(card("urgent", copy.title, copy.body, "Open Panic Helper", "/panic", "event", event.id));
    } else if (days <= 14 && days >= 0) {
      const copy = eventAdviceCopy(input.toneMode, event.title, days);
      cards.push(card("high", copy.title, copy.body, "Plan now", "/panic", "event", event.id));
    } else if (days <= 30 && days >= 0) {
      cards.push(card("medium", `${event.title} in ${days} days`, "Good window to decide before this becomes a scramble.", "View calendar", "/calendar", "event", event.id));
    }
  }

  for (const window of input.supportWindows) {
    const active = isWithinInclusive(input.today, window.startDate, window.endDate);
    const tomorrow = daysBetween(input.today, window.startDate) === 1;
    if (active || tomorrow) {
      const copy = supportCopy(input.toneMode, tomorrow, window.supportActions);
      cards.push(card(active ? "urgent" : "high", copy.title, copy.body, "View support", "/support", "support_pattern", window.id));
    }
  }

  for (const debrief of input.debriefs) {
    if (debrief.followUpAt && daysUntil(debrief.followUpAt, input.today) === 0) {
      cards.push(card("urgent", "Debrief follow-up due today", debrief.betterTiming || debrief.rememberNextTime || "Review the note before you wing the conversation.", "View note", "/debrief/new", "debrief", debrief.id));
    }
  }

  for (const pref of input.preferences) {
    if (pref.importance === "critical") {
      cards.push(card("high", `Critical memory: ${pref.title}`, pref.value, "View memory", "/memory", "preference", pref.id));
    } else if (pref.lastConfirmedAt && daysBetween(pref.lastConfirmedAt, input.today) > 365) {
      cards.push(card("medium", `Confirm ${pref.title}`, "This preference is over a year old. Verify before using it for a gift.", "View memory", "/memory", "preference", pref.id));
    }
  }

  if (!input.events.length) {
    cards.push(card("low", "Add important dates", "Nothing urgent yet. Add dates so PartnerOps can actually help.", "Add date", "/calendar"));
  }
  if (!input.preferences.length) {
    cards.push(card("low", "Add first detail", "Your memory is currently doing all the work. This is historically unreliable.", "Capture detail", "/memory"));
  }

  return cards
    .sort((a, b) => priorityRank(b.priority) - priorityRank(a.priority))
    .slice(0, 5);
}

function card(
  priority: AdviceCard["priority"],
  title: string,
  body: string,
  actionLabel?: string,
  actionRoute?: string,
  relatedEntityType?: AdviceCard["relatedEntityType"],
  relatedEntityId?: string
): AdviceCard {
  return { id: id("advice"), priority, title, body, actionLabel, actionRoute, relatedEntityType, relatedEntityId };
}

function priorityRank(priority: AdviceCard["priority"]): number {
  return { low: 1, medium: 2, high: 3, urgent: 4 }[priority];
}
