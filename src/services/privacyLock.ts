import * as LocalAuthentication from "expo-local-authentication";

type Listener = (locked: boolean) => void;

class PrivacyLock {
  private locked = false;
  private listeners = new Set<Listener>();
  private lastUnlockedAt = 0;

  isLocked(): boolean {
    return this.locked;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  quickLock(): void {
    this.locked = true;
    this.emit();
  }

  lockIfTimedOut(timeoutSeconds: number): void {
    if (timeoutSeconds <= 0) return;
    const elapsed = Date.now() - this.lastUnlockedAt;
    if (this.lastUnlockedAt > 0 && elapsed > timeoutSeconds * 1000) {
      this.quickLock();
    }
  }

  async unlock(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hasHardware || !enrolled) {
      this.locked = false;
      this.lastUnlockedAt = Date.now();
      this.emit();
      return true;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Unlock PartnerOps",
      cancelLabel: "Cancel",
      fallbackLabel: "Use device passcode"
    });
    if (result.success) {
      this.locked = false;
      this.lastUnlockedAt = Date.now();
      this.emit();
    }
    return result.success;
  }

  private emit(): void {
    for (const listener of this.listeners) {
      listener(this.locked);
    }
  }
}

export const privacyLock = new PrivacyLock();
