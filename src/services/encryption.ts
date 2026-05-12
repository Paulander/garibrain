import * as SecureStore from "expo-secure-store";
import CryptoJS from "crypto-js";

const keyName = "partnerops.encryption-key.v1";
const encryptedPrefix = "enc:";

export async function getOrCreateEncryptionKey(): Promise<string> {
  const existing = await SecureStore.getItemAsync(keyName);
  if (existing) return existing;
  const key = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
  await SecureStore.setItemAsync(keyName, key);
  return key;
}

export async function encryptString(value: string): Promise<string> {
  if (!value || value.startsWith(encryptedPrefix)) return value;
  const key = await getOrCreateEncryptionKey();
  return `${encryptedPrefix}${CryptoJS.AES.encrypt(value, key).toString()}`;
}

export async function decryptString(value: string): Promise<string> {
  if (!value.startsWith(encryptedPrefix)) return value;
  const key = await getOrCreateEncryptionKey();
  const raw = value.slice(encryptedPrefix.length);
  const bytes = CryptoJS.AES.decrypt(raw, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export async function encryptObjectFields<T extends object>(entity: T, fields: (keyof T)[]): Promise<T> {
  const clone = { ...entity } as Record<keyof T, unknown>;
  for (const field of fields) {
    const value = clone[field];
    if (typeof value === "string") {
      clone[field] = await encryptString(value);
    }
  }
  return clone as T;
}

export async function decryptObjectFields<T extends object>(entity: T, fields: (keyof T)[]): Promise<T> {
  const clone = { ...entity } as Record<keyof T, unknown>;
  for (const field of fields) {
    const value = clone[field];
    if (typeof value === "string") {
      clone[field] = await decryptString(value);
    }
  }
  return clone as T;
}
