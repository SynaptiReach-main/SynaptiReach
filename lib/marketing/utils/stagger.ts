export function generateStaggerSchedule(
  recipients: any[],
  staggerCount: number,
  intervalMinutes: number
) {
  const batches = [];

  for (
    let i = 0;
    i < recipients.length;
    i += staggerCount
  ) {
    batches.push(
      recipients.slice(
        i,
        i + staggerCount
      )
    );
  }

  return batches.map(
    (batch, index) => ({
      batch,
      delayMinutes:
        index * intervalMinutes,
    })
  );
}
