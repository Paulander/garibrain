import { UserSettings } from "@/src/domain/models";
import { getDatabase } from "@/src/db/database";
import { id, nowUtcISO } from "@/src/utils/dates";
import { upsertJson } from "@/src/db/repositories/baseRepo";

export const settingsRepo = {
  async get(): Promise<UserSettings | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{ data: string }>("SELECT data FROM user_settings ORDER BY created_at LIMIT 1");
    return row ? JSON.parse(row.data) as UserSettings : null;
  },
  async save(settings: UserSettings): Promise<void> {
    await upsertJson("user_settings", settings);
  },
  async createDefault(overrides: Partial<UserSettings> = {}): Promise<UserSettings> {
    const now = nowUtcISO();
    const settings: UserSettings = {
      id: id("settings"),
      toneMode: "standard",
      privacyLevel: "private",
      appLockEnabled: true,
      autoLockTimeoutSeconds: 60,
      notificationPrivacy: "neutral",
      hideNotificationPreviews: true,
      androidScreenshotProtectionEnabled: false,
      aiEnabled: false,
      analyticsEnabled: false,
      onboardingComplete: false,
      createdAt: now,
      updatedAt: now,
      ...overrides
    };
    await this.save(settings);
    return settings;
  }
};
