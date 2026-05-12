export function filterLeadSegment(
  leads: any[],
  segment: string
) {
  switch (segment) {
    case "new":
      return leads.filter(
        (lead) =>
          lead.status === "new"
      );

    case "cold":
      return leads.filter(
        (lead) =>
          lead.status === "cold"
      );

    case "qualified":
      return leads.filter(
        (lead) =>
          lead.status === "qualified"
      );

    case "converted":
      return leads.filter(
        (lead) =>
          lead.status === "converted"
      );

    default:
      return leads;
  }
}
