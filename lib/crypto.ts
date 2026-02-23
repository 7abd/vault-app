
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const PBKDF2_ITERATIONS = 150_000; 
const PBKDF2_HASH = "SHA-256";
const AES_ALGO = "AES-GCM";
const AES_KEY_LENGTH = 256; 

export function bufferToBase64(buffer: ArrayBuffer | Uint8Array) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(b64: string) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
     
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject

    reader.readAsDataURL(file)
  })
}

export async function deriveCryptoKey(masterPassword: string, salt: string): Promise<CryptoKey> {
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(masterPassword),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: PBKDF2_ITERATIONS,
      hash: PBKDF2_HASH,
    },
    baseKey,
    {
      name: AES_ALGO,
      length: AES_KEY_LENGTH,
    },
    false, 
    ["encrypt", "decrypt"]
  );

  return key;
}
export function generateSalt(length = 16): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(length));
}

export async function deriveVerifier(masterPassword: string, salt: string): Promise<string> {
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(masterPassword),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derived = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: PBKDF2_ITERATIONS,
      hash: PBKDF2_HASH,
    },
    baseKey,
    256
  );

  return bufferToBase64(derived);
}


export async function encryptWithKey(plainText: string, key: CryptoKey) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: AES_ALGO, iv },
    key,
    encoder.encode(plainText)
  );

  return {
    encrypted_content: bufferToBase64(ciphertext),
    encryption_iv: bufferToBase64(iv),
  };
}

export async function decryptWithKey(encryptedBase64: string, ivBase64: string, key: CryptoKey) {
  const ct = base64ToBuffer(encryptedBase64);
  const iv = base64ToBuffer(ivBase64);
  const plainBuf = await window.crypto.subtle.decrypt(
    { name: AES_ALGO, iv: new Uint8Array(iv) },
    key,
    ct
  );

  return decoder.decode(plainBuf);
}
