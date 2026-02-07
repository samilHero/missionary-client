import { createCipheriv, createDecipheriv } from 'crypto';

const ALGORITHM = 'aes-128-cbc';

export function encrypt(plaintext: string, key: string): string {
  const keyBytes = Buffer.from(key.substring(0, 16), 'utf-8');
  const ivBytes = keyBytes;

  const cipher = createCipheriv(ALGORITHM, keyBytes, ivBytes);

  let encrypted = cipher.update(plaintext, 'utf-8', 'base64');
  encrypted += cipher.final('base64');

  return encrypted;
}

export function decrypt(ciphertext: string, key: string): string {
  const keyBytes = Buffer.from(key.substring(0, 16), 'utf-8');
  const ivBytes = keyBytes;

  const decipher = createDecipheriv(ALGORITHM, keyBytes, ivBytes);

  let decrypted = decipher.update(ciphertext, 'base64', 'utf-8');
  decrypted += decipher.final('utf-8');

  return decrypted;
}
