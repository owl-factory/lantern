/**
 * Parses the postedAt date into a readable time
 * @param postedAt The datetime that this was posted at
 */
export function parsePostedAt(postedAt?: Date): ParsedMessageAt {
  const parsedPostedAt: ParsedMessageAt = { readable: "", fullDate: "" };

  if (!postedAt) { return parsedPostedAt; }

  const createdAtDate = new Date(postedAt);
  parsedPostedAt.fullDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: "numeric",
    year: "numeric",
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
    // dayPeriod: "short",
  }
  ).format(createdAtDate);

  const now = new Date();
  // Happened longer than a day ago
  if ((now.valueOf() - createdAtDate.valueOf()) > 24 * 60 * 60 * 1000) {
    parsedPostedAt.readable = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: "numeric",
      year: "numeric",
    }
    ).format(createdAtDate);
  } else {
    parsedPostedAt.readable = new Intl.DateTimeFormat('en-US', {
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
      // dayPeriod: "short",
    }
    ).format(createdAtDate);
  }

  return parsedPostedAt;
}

interface ParsedMessageAt {
  readable: string; // The readable string to put next to the message
  fullDate: string; // The full date parsed into a readable string for the tooltip
}
