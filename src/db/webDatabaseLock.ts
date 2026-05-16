export function isWebDatabaseLockError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);

  return (
    message.includes("NoModificationAllowedError") ||
    message.includes("createSyncAccessHandle") ||
    message.includes("Access Handles cannot be created") ||
    message.includes("another open Access Handle") ||
    message.includes("Writable stream associated with the same file")
  );
}
