export type ToneMode = "standard" | "tactical" | "roast";

export type RelationshipType = "wife" | "girlfriend" | "partner" | "fiancee" | "other";

export type Sentiment = "likes" | "dislikes" | "wants" | "needs" | "important" | "neutral";

export type Importance = "low" | "medium" | "high" | "critical";

export type PrivacyLevel = "basic" | "private" | "very_private";

export type NotificationPrivacy = "full" | "neutral" | "minimal" | "silent";

export interface UserSettings {
  id: string;
  toneMode: ToneMode;
  privacyLevel: PrivacyLevel;
  appLockEnabled: boolean;
  autoLockTimeoutSeconds: number;
  notificationPrivacy: NotificationPrivacy;
  hideNotificationPreviews: boolean;
  androidScreenshotProtectionEnabled: boolean;
  aiEnabled: boolean;
  analyticsEnabled: boolean;
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Partner {
  id: string;
  displayName: string;
  relationshipType: RelationshipType;
  birthday?: string;
  anniversary?: string;
  firstMetDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Preference {
  id: string;
  partnerId: string;
  category: string;
  title: string;
  value: string;
  sentiment: Sentiment;
  importance: Importance;
  source?: "she_said_it" | "observed" | "gift_history" | "user_note" | "unknown";
  tags: string[];
  lastConfirmedAt?: string;
  isSensitive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RelationshipEvent {
  id: string;
  partnerId: string;
  title: string;
  eventType: "birthday" | "anniversary" | "first_met" | "wedding_day" | "mothers_day" | "valentines_day" | "custom";
  date: string;
  recurrence: "none" | "yearly" | "monthly" | "weekly" | "custom";
  recurrenceRule?: string;
  leadTimeDays: number[];
  notes?: string;
  linkedPreferenceIds: string[];
  isSensitive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  partnerId: string;
  eventId?: string;
  title: string;
  body?: string;
  dueAt: string;
  status: "pending" | "done" | "dismissed";
  notificationId?: string;
  notificationPrivacy?: NotificationPrivacy;
  createdAt: string;
  updatedAt: string;
}

export interface CycleSettings {
  id: string;
  partnerId: string;
  enabled: boolean;
  lastPeriodStartDate: string;
  averageCycleLengthDays: number;
  periodDurationDays: number;
  prePeriodSupportDays: number;
  regularity: "regular" | "somewhat_irregular" | "irregular";
  supportActions: string[];
  notes?: string;
  notifyDayBefore: boolean;
  notifyMorningOf: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupportPattern {
  id: string;
  partnerId: string;
  name: string;
  patternType: "cycle" | "work_stress" | "family_stress" | "low_energy" | "custom";
  startDate: string;
  endDate?: string;
  recurrence: "none" | "weekly" | "monthly" | "yearly" | "custom";
  recurrenceRule?: string;
  supportActions: string[];
  confidence: "high" | "medium" | "low";
  notes?: string;
  isSensitive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Debrief {
  id: string;
  partnerId: string;
  title: string;
  debriefType:
    | "argument"
    | "date_night"
    | "gift"
    | "family_event"
    | "stressful_week"
    | "apology"
    | "important_conversation"
    | "custom";
  date: string;
  whatHappened?: string;
  whatWorked?: string;
  whatBackfired?: string;
  myPart?: string;
  rememberNextTime?: string;
  betterTiming?: string;
  followUpAt?: string;
  linkedPreferenceIds: string[];
  tags: string[];
  isSensitive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Idea {
  id: string;
  partnerId: string;
  ideaType: "gift" | "date" | "message" | "trip" | "apology";
  occasionEventId?: string;
  title: string;
  description: string;
  whyItFits?: string;
  budget?: "low" | "medium" | "high" | "unknown";
  urgency?: "today" | "few_days" | "one_week" | "two_plus_weeks";
  nextStep?: string;
  saved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdviceCard {
  id: string;
  priority: "low" | "medium" | "high" | "urgent";
  title: string;
  body: string;
  actionLabel?: string;
  actionRoute?: string;
  relatedEntityType?: "event" | "preference" | "support_pattern" | "debrief" | "idea";
  relatedEntityId?: string;
}
