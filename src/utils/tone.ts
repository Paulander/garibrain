import { ToneMode } from "@/src/domain/models";

export function todaySubtitle(tone: ToneMode): string {
  if (tone === "tactical") return "Current relationship briefing.";
  if (tone === "roast") return "Your daily chance to not be useless.";
  return "Here's what matters today.";
}

export function eventAdviceCopy(tone: ToneMode, title: string, days: number): { title: string; body: string } {
  if (tone === "tactical") {
    return {
      title: `${title} T-minus ${days} days`,
      body: "Pick plan, gift, and fallback before panic mode gets a vote."
    };
  }
  if (tone === "roast") {
    return {
      title: `${title} in ${days} days`,
      body: "Future-you is historically unreliable. Handle it now."
    };
  }
  return {
    title: `${title} in ${days} days`,
    body: "Choose a gift or plan today."
  };
}

export function supportCopy(tone: ToneMode, startsTomorrow: boolean, actions: string[]): { title: string; body: string } {
  const timing = startsTomorrow ? "starts tomorrow" : "is active today";
  const actionText = actions.length ? actions.join(", ") : "add support actions";
  if (tone === "tactical") {
    return {
      title: `Support window ${timing}`,
      body: `Recommended actions: ${actionText}.`
    };
  }
  if (tone === "roast") {
    return {
      title: `Support window ${timing}`,
      body: `Your mission: fewer opinions, more useful help. Saved actions: ${actionText}.`
    };
  }
  return {
    title: `Support window ${timing}`,
    body: `Saved actions: ${actionText}.`
  };
}
