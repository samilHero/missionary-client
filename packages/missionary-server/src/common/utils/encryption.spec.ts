import { encrypt, decrypt } from './encryption';

describe('Encryption Utility', () => {
  const TEST_KEY = 'my-secret-key-16'; // Must be at least 16 bytes

  describe('encrypt', () => {
    it('should encrypt plaintext to base64 string', () => {
      const plaintext = 'Hello, World!';
      const encrypted = encrypt(plaintext, TEST_KEY);

      expect(typeof encrypted).toBe('string');
      expect(encrypted).not.toBe(plaintext);
      expect(encrypted.length).toBeGreaterThan(0);
    });

    it('should produce different ciphertext for different inputs', () => {
      const plaintext1 = 'Hello, World!';
      const plaintext2 = 'Goodbye, World!';

      const encrypted1 = encrypt(plaintext1, TEST_KEY);
      const encrypted2 = encrypt(plaintext2, TEST_KEY);

      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should produce consistent ciphertext for same input (deterministic IV)', () => {
      const plaintext = 'Test123';

      const encrypted1 = encrypt(plaintext, TEST_KEY);
      const encrypted2 = encrypt(plaintext, TEST_KEY);

      // Spring uses same key bytes as IV, so encryption is deterministic
      expect(encrypted1).toBe(encrypted2);
    });

    it('should handle empty string', () => {
      const encrypted = encrypt('', TEST_KEY);

      expect(typeof encrypted).toBe('string');
      expect(encrypted.length).toBeGreaterThan(0);
    });

    it('should handle special characters', () => {
      const plaintext = '한글테스트!@#$%^&*()';
      const encrypted = encrypt(plaintext, TEST_KEY);

      expect(typeof encrypted).toBe('string');
      expect(encrypted).not.toBe(plaintext);
    });
  });

  describe('decrypt', () => {
    it('should decrypt ciphertext to original plaintext', () => {
      const plaintext = 'Hello, World!';
      const encrypted = encrypt(plaintext, TEST_KEY);
      const decrypted = decrypt(encrypted, TEST_KEY);

      expect(decrypted).toBe(plaintext);
    });

    it('should handle empty string round-trip', () => {
      const plaintext = '';
      const encrypted = encrypt(plaintext, TEST_KEY);
      const decrypted = decrypt(encrypted, TEST_KEY);

      expect(decrypted).toBe(plaintext);
    });

    it('should handle special characters round-trip', () => {
      const plaintext = '한글테스트!@#$%^&*()';
      const encrypted = encrypt(plaintext, TEST_KEY);
      const decrypted = decrypt(encrypted, TEST_KEY);

      expect(decrypted).toBe(plaintext);
    });

    it('should handle numeric strings', () => {
      const plaintext = '1234567890';
      const encrypted = encrypt(plaintext, TEST_KEY);
      const decrypted = decrypt(encrypted, TEST_KEY);

      expect(decrypted).toBe(plaintext);
    });

    it('should handle long text', () => {
      const plaintext = 'A'.repeat(1000);
      const encrypted = encrypt(plaintext, TEST_KEY);
      const decrypted = decrypt(encrypted, TEST_KEY);

      expect(decrypted).toBe(plaintext);
    });
  });

  describe('Spring Compatibility', () => {
    it('should use key first 16 bytes as both key and IV', () => {
      // This test verifies the Spring quirk: same bytes used for key and IV
      const plaintext = 'Test';
      const key1 = 'my-secret-key-16EXTRA_BYTES';
      const key2 = 'my-secret-key-16DIFFERENT';

      const encrypted1 = encrypt(plaintext, key1);
      const encrypted2 = encrypt(plaintext, key2);

      // Should produce same ciphertext because first 16 bytes are identical
      expect(encrypted1).toBe(encrypted2);
    });

    it('should produce base64-encoded output like Spring', () => {
      const plaintext = 'Test123';
      const encrypted = encrypt(plaintext, TEST_KEY);

      // Base64 regex pattern
      expect(encrypted).toMatch(/^[A-Za-z0-9+/]+=*$/);
    });
  });

  describe('Error Handling', () => {
    it('should throw error if key is too short', () => {
      expect(() => encrypt('test', 'short')).toThrow();
    });

    it('should throw error for invalid base64 during decryption', () => {
      expect(() => decrypt('invalid-base64', TEST_KEY)).toThrow();
    });

    it('should throw error for corrupted ciphertext', () => {
      const encrypted = encrypt('test', TEST_KEY);
      const corrupted = encrypted.slice(0, -4) + 'XXXX';

      expect(() => decrypt(corrupted, TEST_KEY)).toThrow();
    });
  });
});
