import { describe, expect, it } from "vitest";
import { notificationPayload, supportNotificationPayload } from "../src/domain/notificationText";

describe("notificationText", () => {
  it("keeps neutral notifications private", () => {
    expect(notificationPayload("neutral", {
      title: "Her birthday is in 14 days",
      body: "Dark chocolate, no roses"
    })).toEqual({
      title: "Important reminder.",
      body: "Check PartnerOps.",
      shouldSchedule: true
    });
  });

  it("uses minimal and silent modes correctly", () => {
    expect(notificationPayload("minimal", { title: "Birthday" })).toMatchObject({ title: "Reminder.", shouldSchedule: true });
    expect(notificationPayload("silent", { title: "Birthday" })).toMatchObject({ shouldSchedule: false });
  });

  it("does not leak cycle details in neutral support notifications", () => {
    const payload = supportNotificationPayload("neutral");
    expect(`${payload.title} ${payload.body}`.toLowerCase()).not.toContain("cycle");
    expect(`${payload.title} ${payload.body}`.toLowerCase()).not.toContain("period");
  });
});
