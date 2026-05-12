export function getSendTimeRecommendation(
  type: string
) {
  const map: any = {
    email: {
      bestDays: [
        "Tuesday",
        "Wednesday",
        "Thursday",
      ],

      bestHours: [
        "9 AM",
        "11 AM",
        "1 PM",
      ],
    },

    sms: {
      bestDays: [
        "Tuesday",
        "Friday",
      ],

      bestHours: [
        "12 PM",
        "4 PM",
      ],
    },

    social: {
      bestDays: [
        "Monday",
        "Wednesday",
        "Saturday",
      ],

      bestHours: [
        "10 AM",
        "3 PM",
        "7 PM",
      ],
    },
  };

  return (
    map[type] ||
    map.email
  );
}
