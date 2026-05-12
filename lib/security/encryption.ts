import crypto from "crypto";

const algorithm = "aes-256-cbc";

const secret =
  process.env.ENCRYPTION_SECRET!;

const key = crypto
  .createHash("sha256")
  .update(secret)
  .digest();

export function encrypt(
  text: string
) {
  const iv =
    crypto.randomBytes(16);

  const cipher =
    crypto.createCipheriv(
      algorithm,
      key,
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
  encryptedText: string
) {
  const parts =
    encryptedText.split(":");

  const iv = Buffer.from(
    parts.shift()!,
    "hex"
  );

  const encrypted =
    parts.join(":");

  const decipher =
    crypto.createDecipheriv(
      algorithm,
      key,
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
