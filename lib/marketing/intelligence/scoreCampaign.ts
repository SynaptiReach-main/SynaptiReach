export function scoreCampaign(
  campaign: any
) {
  let score = 0;

  const subject =
    (
      campaign.subject || ""
    ).toLowerCase();

  const body =
    (
      campaign.body || ""
    ).toLowerCase();

  if (
    subject.length > 10
  ) {
    score += 10;
  }

  if (
    subject.length > 30
  ) {
    score += 10;
  }

  if (
    body.length > 120
  ) {
    score += 10;
  }

  if (
    body.includes(
      "limited"
    )
  ) {
    score += 8;
  }

  if (
    body.includes(
      "exclusive"
    )
  ) {
    score += 8;
  }

  if (
    body.includes(
      "free"
    )
  ) {
    score += 6;
  }

  if (
    body.includes(
      "today"
    )
  ) {
    score += 5;
  }

  if (
    body.includes(
      "save"
    )
  ) {
    score += 5;
  }

  if (
    campaign.media?.length
  ) {
    score += 15;
  }

  if (
    campaign.stagger_size
  ) {
    score += 8;
  }

  if (
    campaign.segment
  ) {
    score += 10;
  }

  return Math.min(
    score,
    100
  );
}
