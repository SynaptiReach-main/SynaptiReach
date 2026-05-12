const memoryStore =
  new Map();

export function rateLimit(
  key: string,
  limit = 50,
  windowMs = 60000
) {
  const now =
    Date.now();

  const current =
    memoryStore.get(
      key
    ) || {
      count: 0,
      expires:
        now + windowMs,
    };

  if (
    now >
    current.expires
  ) {
    current.count = 0;

    current.expires =
      now + windowMs;
  }

  current.count++;

  memoryStore.set(
    key,
    current
  );

  return (
    current.count <= limit
  );
}
