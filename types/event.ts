export interface Event {
  id: string;
  slug: string;
  title: string;
  type: "past" | "upcoming";
  thumbnail: string;
  description: string;
  speaker: string;
  date: string;
  venue: string;
  summary?: string;
  recordingLink?: string;
  // Access control — backend dev must enforce these on API + public event page
  restricted?: boolean;   // true = only subscribed users can view full details
  isActive?: boolean;     // false = event hidden from public listing
}
