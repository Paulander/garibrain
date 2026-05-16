import { describe, expect, it } from "vitest";
import { isWebDatabaseLockError } from "@/src/db/webDatabaseLock";

describe("webDatabaseLock", () => {
  it("recognizes browser OPFS access-handle lock errors", () => {
    expect(
      isWebDatabaseLockError(
        new Error(
          "NoModificationAllowedError: Failed to execute 'createSyncAccessHandle' on 'FileSystemFileHandle': Access Handles cannot be created if there is another open Access Handle or Writable stream associated with the same file."
        )
      )
    ).toBe(true);
  });

  it("ignores unrelated database failures", () => {
    expect(isWebDatabaseLockError(new Error("SQLITE_CORRUPT: database disk image is malformed"))).toBe(false);
  });
});
