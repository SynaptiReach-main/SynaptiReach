import crypto from "crypto";

const algorithm =
  "aes-256-cbc";

function getSecret() {
  const envSecret =
    process.env.ENCRYPTION_SECRET;

  if (
    typeof envSecret ===
      "string" &&
    envSecret.trim().length > 0
  ) {
    return envSecret;
  }

  return "synaptireach-dev-fallback-secret";
}

function getKey() {
  return crypto
    .createHash("sha256")
    .update(getSecret())
    .digest();
}

export function encrypt(
  text: string
) {
  if (!text) {
    return "";
  }

  const iv =
    crypto.randomBytes(16);

  const cipher =
    crypto.createCipheriv(
      algorithm,
      getKey(),
      iv
    );

  let encrypted =
    cipher.update(
      text,
      "utf8",
      "hex"
    );

  encrypted +=
    cipher.final("hex");

  return `${iv.toString(
    "hex"
  )}:${encrypted}`;
}

export function decrypt(
  encryptedText?: string
) {
  if (
    !encryptedText ||
    typeof encryptedText !==
      "string"
  ) {
    return "";
  }

  if (
    !encryptedText.includes(":")
  ) {
    return "";
  }

  const parts =
    encryptedText.split(":");

  const ivHex =
    parts.shift();

  if (!ivHex) {
    return "";
  }

  const iv =
    Buffer.from(
      ivHex,
      "hex"
    );

  const encrypted =
    parts.join(":");

  const decipher =
    crypto.createDecipheriv(
      algorithm,
      getKey(),
      iv
    );

  let decrypted =
    decipher.update(
      encrypted,
      "hex",
      "utf8"
    );

  decrypted +=
    decipher.final("utf8");

  return decrypted;
}
