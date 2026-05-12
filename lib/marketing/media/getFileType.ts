export function getFileType(
  filename: string
) {
  const lower =
    filename.toLowerCase();

  if (
    lower.endsWith(".png") ||
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".webp") ||
    lower.endsWith(".gif")
  ) {
    return "image";
  }

  if (
    lower.endsWith(".mp4") ||
    lower.endsWith(".mov") ||
    lower.endsWith(".webm")
  ) {
    return "video";
  }

  return "file";
}
