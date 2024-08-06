import SHA256 from "crypto-js/sha256";

export function useGenerateSecret(key: string, length: number = 16): string {
  const hash = SHA256(key + import.meta.env.VITE_EMAIL_SECRET_SALT).toString();
  return hash.substring(0, length);
}
