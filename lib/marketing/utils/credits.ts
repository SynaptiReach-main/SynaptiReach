export function estimateAICredits(
  text: string,
  mediaCount: number = 0
) {
  const base =
    Math.ceil(text.length / 100);

  const mediaCost =
    mediaCount * 25;

  return base + mediaCost;
}
